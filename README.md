# คู่มือติดตั้งและ Deploy Smart Catalog Project

## โครงสร้างโปรเจค
```
smartcatalog/
├── smartcatalog-api/        # Backend API
│   ├── src/
│   │   ├── config/         # การตั้งค่าต่างๆ
│   │   ├── controllers/    # ตัวควบคุมการทำงาน
│   │   ├── middleware/     # ตัวกลางจัดการ request
│   │   ├── models/         # โมเดลฐานข้อมูล
│   │   ├── routes/         # เส้นทาง API
│   │   ├── uploads/        # ที่เก็บไฟล์อัพโหลด
│   │   └── utils/          # ฟังก์ชันช่วยเหลือ
│   └── app.js              # ไฟล์หลัก
└── smartcatalog-web/       # Frontend
    ├── src/
    │   ├── Admin/          # ส่วนผู้ดูแลระบบ
    │   ├── Client/         # ส่วนผู้ใช้งาน
    │   └── assets/         # ไฟล์ static
    └── index.html
```
## 1. การติดตั้งระบบบน Ubuntu Server 22.04.5 LTS

### 1.1 อัพเดทระบบ
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 การติดตั้ง Node.js
#### 1.2.1 ติดตั้ง Node.js
```bash
# เพิ่ม NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# ติดตั้ง Node.js และ npm
sudo apt install -y nodejs npm

# ตรวจสอบเวอร์ชัน
node --version
npm --version
```
#### 1.2.2 ถอนการติดตั้ง Node.js
```bash
# ลบ Node.js และ npm
sudo apt remove nodejs npm
# ลบไฟล์การตั้งค่าที่เหลือ
sudo apt purge nodejs npm
```

### 1.3 การติดตั้ง Nginx และ Nginx UI
#### 1.3.1 ติดตั้ง Nginx
```bash
sudo apt install nginx

# เริ่มการทำงาน Nginx
sudo systemctl start nginx

# ตั้งค่าให้ Nginx ทำงานตอนเปิดเครื่อง
sudo systemctl enable nginx

# ตรวจสอบสถานะ
sudo systemctl status nginx
```

#### 1.3.2 ติดตั้ง Nginx UI
```bash
# ติดตั้ง Nginx UI
sudo bash -c "$(curl -L https://raw.githubusercontent.com/0xJacky/nginx-ui/main/install.sh)" @ install

# เปิดใช้งานและเริ่มต้นบริการ
sudo systemctl enable nginx-ui
sudo systemctl start nginx-ui

# ตรวจสอบสถานะ
sudo systemctl status nginx-ui

# เข้าเว็บ Nginx UI
# http://<your-ip>:9000
```

#### 1.3.3 ตั้งค่า SSL Certificate ด้วย Nginx UI (ถ้าใช้ Cloudflare)
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

# 3. สร้าง symbolic link กับตำแหน่งไฟล์ certification
sudo mkdir -p /etc/nginx/ssl/smartcatalog
sudo ln -sf /etc/nginx/ssl/*.<domain>_2048/fullchain.cer /etc/nginx/ssl/smartcatalog/fullchain.pem
sudo ln -sf /etc/nginx/ssl/*.<domain>_2048/private.key /etc/nginx/ssl/smartcatalog/privkey.pem

# ตรวจสอบว่า symbolic link ถูกสร้างขึ้นอย่างถูกต้อง
ls -la /etc/nginx/ssl/smartcatalog/
```

#### 1.3.4 ถอนการติดตั้ง Nginx และ Nginx UI
```bash
# หยุดการทำงาน Nginx UI
sudo systemctl stop nginx-ui
sudo systemctl disable nginx-ui

# ถอนการติดตั้ง Nginx UI
sudo bash -c "$(curl -L https://raw.githubusercontent.com/0xJacky/nginx-ui/main/install.sh)" @ uninstall

# หยุดการทำงาน Nginx
sudo systemctl stop nginx
sudo systemctl disable nginx

# ถอนการติดตั้ง Nginx
sudo apt remove nginx nginx-common

# ลบไฟล์การตั้งค่าทั้งหมด
sudo apt purge nginx nginx-common

# ลบ dependencies ที่ไม่ได้ใช้
sudo apt autoremove
```

### 1.4 ติดตั้ง PM2
```bash
sudo npm install -g pm2
```

## 1.5 การติดตั้ง MongoDB 4.4 (เนื่อยงจาก hardware รองรับ)

#### 1.5.1 ติดตั้ง Dependencies
```bash
wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
```

##### 1.5.2 เพิ่ม MongoDB Repository
```bash
curl -fsSL https://pgp.mongodb.com/server-4.4.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-4.4.gpg --dearmor && echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-4.4.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```

#### 1.5.3 ติดตั้ง MongoDB
```bash
sudo apt update
sudo apt install -y mongodb-org
```

#### 1.5.4 ตั้งค่า Directories และ Permissions
```bash
sudo mkdir -p /var/lib/mongodb
sudo mkdir -p /var/log/mongodb
sudo mkdir -p /data/db
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
sudo chown mongodb:mongodb /etc/mongod.conf
sudo chown -R mongodb:mongodb /data/db
```

#### 1.5.5 เริ่มการทำงาน MongoDB
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 1.5.6 ติดตั้ง MongoDB Client Tools
```bash
sudo apt-get install -y mongodb-clients
```

#### 1.5.7 นำเข้าข้อมูล
```bash
cd ~/smartcatalog/databases/mongodb/mongodb_backup/smartcatalog
mongorestore --host localhost --port 27017 --db smartcatalog ./
```

#### 1.5.8 ตรวจสอบข้อมูล
```bash
# เข้าสู่ MongoDB Shell
mongosh
# สลับไปยัง database ที่ต้องการลบ
use smartcatalog
# แสดง collection ทั้งหมด
show collections
# ดูข้อมูลใน collection (ตัวอย่างดู collection products)
db.products.find().pretty()
# ดูจำนวนข้อมูล
db.products.countDocuments()
```

#### 1.5.9 การเคลียร์ Database
```bash
# ลบ collection เฉพาะที่ต้องการ
db.brands.drop()
# หรือลบทั้ง database
db.dropDatabase()
# ตรวจสอบว่าลบสำเร็จ
show dbs
```

#### 1.5.10 การถอนการติดตั้ง MongoDB
```bash
# หยุดการทำงาน
sudo systemctl stop mongod
sudo systemctl disable mongod

# ถอนการติดตั้งและลบไฟล์
sudo apt-get purge mongodb-org*
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongodb
sudo rm -r /data/db
sudo rm /etc/mongod.conf
sudo rm /usr/lib/systemd/system/mongod.service
sudo rm /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo rm /usr/share/keyrings/mongodb-server-4.4.gpg

# อัพเดท Package List
sudo apt-get update
```

### 1.6 การ Deploy

#### 1.6.1 Deploy Frontend
```bash
cd smartcatalog-web
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

#### 1.6.2 Deploy Backend
```bash
cd smartcatalog-api
npm install
pm2 start app.js --name "smartcatalog-api"
pm2 save
```

#### 1.6.3 ตั้งค่า Nginx (กรณีใช้ Command Line)
```bash
sudo nano /etc/nginx/sites-available/smartcatalog

# เพิ่มการตั้งค่า
server {
    listen 80;
    server_name domain.adcmdev.cloud;
    
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
    server_name domain.adcmdev.cloud;
    
    ssl_certificate /etc/nginx/ssl/smartcatalog/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/smartcatalog/privkey.pem;
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}

# เปิดใช้งาน config
sudo ln -s /etc/nginx/sites-available/smartcatalog /etc/nginx/sites-enabled/

# ปิดการใช้งานไฟล์ default (สำคัญ!)
sudo mv /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.bak

# ตรวจสอบ syntax และรีสตาร์ท Nginx
sudo nginx -t
sudo systemctl restart nginx
```

#### 1.6.4 ตั้งค่า Nginx (กรณีใช้ Nginx UI)
```
# 1. เข้าเว็บ Nginx UI: http://<your-ip>:9000
# 2. ไปที่: Manage Configs
# 3. สร้างไฟล์ใหม่: smartcatalog.conf
# 4. ใส่เนื้อหาเดียวกับในข้อ 1.6.3
# 5. บันทึกและใช้งาน
# 6. ตรวจสอบสถานะด้วยการไปที่ Dashboard

# 7. อัพเดทไฟล์คอนฟิกหลัก (ถ้าจำเป็น)
# - แก้ไขไฟล์: nginx.conf
# - เพิ่มในส่วน http:
# include /etc/nginx/smartcatalog.conf;
```

## 2. การติดตั้งระบบบน Ubuntu Server 22.04.5 LTS โดยใช้ Docker
# (ส่วนนี้เดิม ไม่มีการเปลี่ยนแปลง)