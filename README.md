# คู่มือติดตั้งและ Deploy Smart Catalog Project บน Amazon EC2

## สารบัญ
1. [ข้อมูลทั่วไปของโปรเจค](#ข้อมูลทั่วไปของโปรเจค)
2. [การติดตั้งระบบบน Ubuntu Server 24.04 LTS](#การติดตั้งระบบบน-ubuntu-server-2404-lts)
   1. [การเตรียมระบบ](#21-การเตรียมระบบ)
   2. [การติดตั้ง Node.js](#22-การติดตั้ง-nodejs)
   3. [การติดตั้ง MongoDB](#23-การติดตั้ง-mongodb-70)
   4. [การติดตั้ง PM2](#24-การติดตั้ง-pm2)
   5. [การติดตั้ง Nginx และ Nginx UI](#25-การติดตั้ง-nginx-และ-nginx-ui)
   6. [การ Deploy Smart Catalog](#26-การ-deploy-smart-catalog)
3. [การบำรุงรักษาระบบ](#การบำรุงรักษาระบบ)
   1. [การจัดการฐานข้อมูล](#31-การจัดการฐานข้อมูล)
4. [การติดตั้งระบบโดยใช้ Docker](#การติดตั้งระบบโดยใช้-docker)

## ข้อมูลทั่วไปของโปรเจค

### โครงสร้างโปรเจค
```
smart-catalog/
├── smartcatalog-api/        # Backend API
│   ├── src/
│   │   ├── config/         
│   │   ├── controllers/    
│   │   ├── middleware/     
│   │   ├── models/         
│   │   ├── routes/         
│   │   ├── uploads/        
│   │   └── utils/          
│   └── app.js              
├── smartcatalog-web/       # Frontend
│   ├── src/
│   │   ├── Admin/          
│   │   ├── Client/         
│   │   └── assets/         
│   └── index.html
└── database/
    └── mongodb/
        └── mongodb_backup/
            └── smartcatalog/    # ข้อมูลสำรอง MongoDB
```

## การติดตั้งระบบบน Ubuntu Server 24.04 LTS บน Amazon EC2

### 2.1 การเตรียมระบบ

#### อัพเดทระบบ
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 การติดตั้ง Node.js

```bash
# ติดตั้ง Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# ตรวจสอบเวอร์ชัน
node -v
npm -v
```

### 2.3 การติดตั้ง MongoDB 7.0

#### 2.3.1 เพิ่ม MongoDB Repository
```bash
# Import MongoDB public GPG Key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# สร้างไฟล์ repository list สำหรับ MongoDB (ใช้ jammy แทน noble เนื่องจาก MongoDB ยังไม่รองรับ noble)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

#### 2.3.2 ติดตั้ง MongoDB
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
```

#### 2.3.3 ตั้งค่า Directories และ Permissions
```bash
sudo mkdir -p /var/lib/mongodb
sudo mkdir -p /var/log/mongodb
sudo mkdir -p /data/db
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
sudo chown -R mongodb:mongodb /data/db
```

#### 2.3.4 ตั้งค่าและเริ่มบริการ MongoDB
```bash
# เริ่มบริการ MongoDB
sudo systemctl start mongod

# ตรวจสอบสถานะ
sudo systemctl status mongod

# ตั้งค่าให้ MongoDB ทำงานเมื่อเริ่มระบบ
sudo systemctl enable mongod
```

#### 2.3.5 ทดสอบการเชื่อมต่อ MongoDB
```bash
# เรียกใช้ MongoDB Shell
mongosh

# คำสั่งพื้นฐานใน mongosh
# show dbs
# use admin
# db.version()
# exit
```

#### 2.3.6 นำเข้าข้อมูล MongoDB
```bash
cd ~/smart-catalog/database/mongodb/mongodb_backup/smartcatalog
mongorestore --host localhost --port 27017 --db smartcatalog ./
```

#### 2.3.7 การแก้ไขปัญหาที่พบบ่อย
```bash
# กรณี MongoDB ไม่สามารถเริ่มต้นได้ (exit code 14)
# 1. ตรวจสอบข้อผิดพลาดโดยละเอียด
sudo cat /var/log/mongodb/mongod.log | tail -n 50
sudo journalctl -u mongod.service -n 50

# 2. ลบไฟล์ socket ที่อาจค้างอยู่
sudo rm -f /tmp/mongodb-27017.sock

# 3. รีสตาร์ท MongoDB
sudo systemctl restart mongod
```

### 2.4 การติดตั้ง PM2
```bash
sudo npm install -g pm2
```

### 2.5 การติดตั้ง Nginx และ Nginx UI

#### 2.5.1 ติดตั้ง Nginx
```bash
sudo apt install nginx -y

# ตั้งค่าให้ Nginx ทำงานตอนเปิดเครื่อง
sudo systemctl enable nginx

# ตรวจสอบสถานะ
sudo systemctl status nginx
```

#### 2.5.2 ติดตั้ง Nginx UI
```bash
# ติดตั้ง Nginx UI
sudo bash -c "$(curl -L https://raw.githubusercontent.com/0xJacky/nginx-ui/main/install.sh)" @ install

# ตั้งค่าให้ nginx-ui ทำงานตอนเปิดเครื่อง
sudo systemctl enable nginx-ui

# ตรวจสอบสถานะ
sudo systemctl status nginx-ui

# เข้าเว็บ Nginx UI
# http://<your-ip>:9000
# Security Groups (พอร์ตที่ต้องเปิด):
# Port 9000 (Nginx UI)
```

#### 2.5.3 ตั้งค่า SSL Certificate ด้วย Nginx UI (กรณีใช้ Cloudflare)
```bash
# 1. ตั้งค่า DNS Credentials
# - เข้าเว็บ Nginx UI: http://<your-ip>:9000
# - ไปที่: Certificates > DNS Credentials
# - เพิ่มข้อมูล Cloudflare:
#   - API Token
#   - อีเมล

# 2. สร้าง Certificate
# - ไปที่: Certificates > Certificates List
# - สร้าง Issue Wildcard Certificate ใหม่
# - กรอกข้อมูลโดเมน
# - เลือก Cloudflare เป็น DNS Provider

# 3. ตรวจสอบไฟล์ certificate ที่สร้าง
sudo ls -la /etc/nginx/ssl/
# จะเห็นโฟลเดอร์ที่มีชื่อโดเมนของคุณ เช่น *.example.com_example.com_2048

# 4. ตรวจสอบไฟล์ภายในโฟลเดอร์ certificate
sudo ls -la '/etc/nginx/ssl/[ชื่อโฟลเดอร์ที่พบในขั้นตอนที่ 3]/'
# จะเห็นไฟล์ fullchain.cer และ private.key

# 5. สร้างโฟลเดอร์สำหรับเก็บ symbolic link
sudo mkdir -p /etc/nginx/ssl/smartcatalog

# 6. สร้าง symbolic link ด้วยเส้นทางที่ถูกต้อง (แทนที่ด้วยชื่อโฟลเดอร์จริง)
sudo ln -sf '/etc/nginx/ssl/[ชื่อโฟลเดอร์ที่พบในขั้นตอนที่ 3]/fullchain.cer' /etc/nginx/ssl/smartcatalog/fullchain.pem
sudo ln -sf '/etc/nginx/ssl/[ชื่อโฟลเดอร์ที่พบในขั้นตอนที่ 3]/private.key' /etc/nginx/ssl/smartcatalog/privkey.pem

# 7. ตรวจสอบว่า symbolic link ถูกสร้างขึ้นอย่างถูกต้อง
ls -la /etc/nginx/ssl/smartcatalog/
# ควรเห็น fullchain.pem ชี้ไปที่ไฟล์ fullchain.cer และ privkey.pem ชี้ไปที่ไฟล์ private.key

# 8. ทดสอบการตั้งค่า Nginx
sudo nginx -t
```

### 2.6 การ Deploy Smart Catalog

#### 2.6.1 Deploy Frontend

#### 2.6.2 Deploy Frontend
```bash
cd smartcatalog-web
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

#### 2.6.3 Deploy Backend
```bash
cd smartcatalog-api
npm install
pm2 start app.js --name "smartcatalog-api"
pm2 save
```

#### 2.6.4 ตั้งค่า Nginx

##### กรณีใช้ Command Line

###### การตั้งค่าสำหรับเว็บไซต์หลัก
```bash
sudo nano /etc/nginx/sites-available/smartcatalog

# เพิ่มการตั้งค่า
server {
    listen 80;
    server_name <domain>
    
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 443 ssl;
    server_name <domain>
    
    ssl_certificate /etc/nginx/ssl/smartcatalog/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/smartcatalog/privkey.pem;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}
```

###### การตั้งค่าสำหรับ API
```bash
sudo nano /etc/nginx/sites-available/smartcatalog-api

# เพิ่มการตั้งค่า
server {
    listen 80;
    server_name <domain>; 

    location / {
        if ($http_cf_visitor ~ '{"scheme":"https"}') {
            proxy_pass http://localhost:3000;
            break;
        }
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name <domain>; 
    
    ssl_certificate /etc/nginx/ssl/smartcatalog/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/smartcatalog/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# ตรวจสอบ syntax และรีสตาร์ท Nginx
sudo nginx -t
sudo systemctl restart nginx
```

##### กรณีใช้ Nginx UI
1. เข้าเว็บ Nginx UI: http://<your-ip>:9000
2. ไปที่: Manage Configs
3. สร้างไฟล์ใหม่:
   - สร้างไฟล์ `smartcatalog.conf` สำหรับเว็บไซต์หลัก
   - สร้างไฟล์ `smartcatalog-api.conf` สำหรับ API

4. ใส่เนื้อหาสำหรับ `smartcatalog.conf`:
```
server {
    listen 80;
    server_name <domain>
    
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 443 ssl;
    server_name <domain>
    
    ssl_certificate /etc/nginx/ssl/smartcatalog/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/smartcatalog/privkey.pem;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}
```

5. ใส่เนื้อหาสำหรับ `smartcatalog-api.conf`:
```
server {
    listen 80;
    server_name <domain>; 

    location / {
        if ($http_cf_visitor ~ '{"scheme":"https"}') {
            proxy_pass http://localhost:3000;
            break;
        }
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name <domain>; 
    
    ssl_certificate /etc/nginx/ssl/smartcatalog/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/smartcatalog/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. บันทึกและใช้งานไฟล์คอนฟิก
7. ตรวจสอบสถานะด้วยการไปที่ Dashboard
8. อัพเดทไฟล์คอนฟิกหลัก (ถ้าจำเป็น)
   - แก้ไขไฟล์: nginx.conf
   - เพิ่มในส่วน http: 
   ```
   include /etc/nginx/sites-available/smartcatalog.conf;
   include /etc/nginx/sites-available/smartcatalog-api.conf;
   ```

## การบำรุงรักษาระบบ

### 3.1 การจัดการฐานข้อมูล

#### ตรวจสอบข้อมูล MongoDB
```bash
# เข้าสู่ MongoDB Shell
mongosh
# สลับไปยัง database
use smartcatalog
# แสดง collection ทั้งหมด
show collections
# ดูข้อมูลใน collection (ตัวอย่างดู collection products)
db.products.find().pretty()
# ดูจำนวนข้อมูล
db.products.countDocuments()
```

#### การเคลียร์ฐานข้อมูล
```bash
# ลบ collection เฉพาะที่ต้องการ
db.brands.drop()
# หรือลบทั้ง database
db.dropDatabase()
# ตรวจสอบว่าลบสำเร็จ
show dbs
```

## การติดตั้งระบบโดยใช้ Docker

รายละเอียดการติดตั้งด้วย Docker จะเพิ่มเติมในเวอร์ชันถัดไป