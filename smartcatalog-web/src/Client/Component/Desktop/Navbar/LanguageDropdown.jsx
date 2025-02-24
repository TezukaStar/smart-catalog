// src/components/LanguageDropdown.jsx

import { useState, Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'

const LANGUAGES = [
  {
    code: 'th',
    label: 'ไทย',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/320px-Flag_of_Thailand.svg.png',
  },
  {
    code: 'en',
    label: 'ENG',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/800px-Flag_of_the_United_Kingdom_%281-2%29.svg.png',
  },
]

export default function LanguageDropdown() {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0])

  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* ปุ่ม Dropdown */}
      <div>
        <MenuButton
          className="
            inline-flex items-center
            gap-x-1
            rounded-md bg-white
            px-3 py-2     /* เพิ่ม Padding ให้ใหญ่ขึ้นนิดนึง */
            text-sm font-medium text-gray-900  /* ฟอนต์ขนาดเล็ก-กลาง (text-sm) */
            
          "
        >
          {/* ธง (24x24) ทรงกลม + เพิ่มระยะห่าง mr-3 */}
          <img
            src={selectedLang.flag}
            alt={selectedLang.label}
            className="
              h-6 w-6
              rounded-full
              object-cover
              mr-3         /* เว้นระยะห่างจากข้อความมากขึ้น */
            "
          />
          {selectedLang.label}
          <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </MenuButton>
      </div>

      {/* Transition แสดง/ซ่อนเมนู */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <MenuItems
          className="
            absolute right-0 z-10 mt-1 w-40
            origin-top-right divide-y divide-gray-100
            rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none
          "
        >
          <div className="py-1">
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang.code}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => setSelectedLang(lang)}
                    className={`
                      ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                      group flex w-full items-center
                      px-3 py-2
                      text-sm
                    `}
                  >
                    {/* ธงในเมนู (24x24) เช่นกัน */}
                    <img
                      src={lang.flag}
                      alt={lang.label}
                      className="
                        h-6 w-6
                        rounded-full
                        object-cover
                        mr-3
                      "
                    />
                    <span className="flex-1 text-left">{lang.label}</span>
                    {selectedLang.code === lang.code && (
                      <CheckIcon className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                    )}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
