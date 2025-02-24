// src/components/Nav/MenuDropdown.jsx
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom"; // ✅ Import Link

const MENU_SECTION_1 = [{ label: "หน้าแรก", path: "/" }];
const MENU_SECTION_2 = [
  {
    label: "กล้องวงจร",
    dropdownItems: [
      { title: "สเปคกล้อง", description: "รายละเอียดกล้องวงจรคุณภาพสูง" },
      { title: "แบรนด์ยอดนิยม", description: "เลือกแบรนด์ที่ได้รับความนิยม" },
      { title: "ราคาโปรโมชั่น", description: "ข้อเสนอราคาที่ดีที่สุด" },
    ],
  },
  {
    label: "แผงโซล่าเซลล์",
    dropdownItems: [
      { title: "ชนิดแผง", description: "เลือกชนิดแผงที่เหมาะกับคุณ" },
      { title: "การติดตั้ง", description: "คำแนะนำการติดตั้งอย่างมืออาชีพ" },
      { title: "ราคาและโปรโมชั่น", description: "ข้อเสนอพิเศษสำหรับคุณ" },
    ],
  },
  {
    label: "ระบบเน็ตเวิร์ค",
    dropdownItems: [
      { title: "อุปกรณ์เครือข่าย", description: "เราเตอร์และสวิตช์คุณภาพ" },
      { title: "การติดตั้ง", description: "การติดตั้งโดยผู้เชี่ยวชาญ" },
      { title: "บริการ", description: "บริการหลังการขายครบวงจร" },
    ],
  },
  {
    label: "จัดเซตโปรโมชั่น",
    dropdownItems: [
      { title: "ชุดประหยัด", description: "ชุดอุปกรณ์ครบในราคาพิเศษ" },
      { title: "โปรโมชั่นรายเดือน", description: "ข้อเสนอรายเดือนสุดคุ้ม" },
      { title: "แนะนำเซต", description: "เซตที่ตอบโจทย์ทุกการใช้งาน" },
    ],
  },
];
const MENU_SECTION_3 = [
  { label: "เกี่ยวกับเรา", path: "/about" },
  { label: "ติดต่อ", path: "/contact" },
];

export default function MenuDropdown() {
  return (
    <div className="bg-gray-100 p-3 shadow-md hidden md:block">
      <div className="container mx-auto  flex items-center justify-between gap-2 lg:gap-4 flex-nowrap">
        
        {/* ✅ Section 1 - ปุ่ม "หน้าแรก" */}
        <div className="flex items-center gap-2">
          {MENU_SECTION_1.map((menu, index) => (
            <Link
              key={index}
              to={menu.path}
              className="px-2 lg:px-3 py-1 text-black font-semibold hover:text-blue-500 whitespace-nowrap text-sm lg:text-lg"
            >
              {menu.label}
            </Link>
          ))}
        </div>

        {/* ✅ Section 2 - Dropdown เมนู */}
        <div className="flex items-center gap-2 lg:gap-4">
          {MENU_SECTION_2.map((menu, index) => (
            <Menu as="div" key={index} className="relative inline-block text-left">
              <Menu.Button
                className="flex items-center px-2 lg:px-3 py-1 text-black font-semibold hover:text-blue-500 whitespace-nowrap text-sm lg:text-base"
              >
                {menu.label}
                <ChevronDownIcon className="ml-1 lg:ml-2 h-4 w-4 text-gray-500" />
              </Menu.Button>

              <Transition
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Menu.Items
                  className="
                    absolute left-1/2 transform -translate-x-1/2 z-10 mt-2 
                    w-[90vw] sm:w-[70vw] lg:w-[60vw] max-w-screen-lg
                    bg-white shadow-lg ring-1 ring-black ring-opacity-5
                    p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg
                  "
                >
                  {menu.dropdownItems.map((item, idx) => (
                    <Menu.Item key={idx}>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                          } block p-2 sm:p-4 rounded-md`}
                        >
                          <p className="font-semibold text-xs sm:text-sm">
                            {item.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            {item.description}
                          </p>
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          ))}
        </div>

        {/* ✅ Section 3 - ปุ่ม "เกี่ยวกับเรา" และ "ติดต่อ" */}
        <div className="flex items-center gap-4 lg:gap-16">
          {MENU_SECTION_3.map((menu, index) => (
            <Link
              key={index}
              to={menu.path}
              className="px-2 lg:px-3 py-1 text-black font-semibold hover:text-blue-500 whitespace-nowrap text-sm lg:text-base"
            >
              {menu.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
