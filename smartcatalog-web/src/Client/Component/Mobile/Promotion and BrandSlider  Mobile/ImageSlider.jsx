import { useState, useEffect } from "react";

const images = [
  {
    id: 1,
    src: "https://ihavecpu.com/_next/image?url=https%3A%2F%2Fihcupload.s3.ap-southeast-1.amazonaws.com%2Fimg%2Fslidebanner%2F1735668657677433b1ada4c.jpg&w=3840&q=75",
    alt: "Slide 1",
    caption: "Light Up Your Holidays with GeForce RTX",
  },
  {
    id: 2,
    src: "https://ihavecpu.com/_next/image?url=https%3A%2F%2Fihcupload.s3.ap-southeast-1.amazonaws.com%2Fimg%2Fslidebanner%2F1735812022677663b6793e4.jpg&w=3840&q=75",
    alt: "Slide 2",
    caption: "Ultimate Gaming, Creating, and AI",
  },
  {
    id: 3,
    src: "https://ihavecpu.com/_next/image?url=https%3A%2F%2Fihcupload.s3.ap-southeast-1.amazonaws.com%2Fimg%2Fslidebanner%2F17365682406781edb0835c7.jpg&w=3840&q=75",
    alt: "Slide 3",
    caption: "Promotion COMSET GIGABYTE GEFORCE RTX",
  },
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // เลื่อนทุก 4 วินาที

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[90%] mx-auto mt-10 mb-10 px-2 lg:px-6">
      {/* Container: มีระยะห่าง */}
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((image) => (
            <div key={image.id} className="flex-none w-full">
              {/* รูปภาพ */}
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto max-h-[600px] object-cover"
              />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                <h2 className="text-lg font-bold">{image.caption}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
