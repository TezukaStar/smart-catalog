import { useState, useEffect } from "react";
import BrandSlider from "./BrandSlider"; 

const images = [
  {
    id: 1,
    src: "https://scontent.fphs2-1.fna.fbcdn.net/v/t39.30808-6/469571180_578163058127906_3728558406565776001_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeG2NqSNaBJYYJ2l-Wm_ka-zFpiUxohQ7BkWmJTGiFDsGYZ0CB6DlN-uzq60PQrG3mwvQYzCwtbA1wl4C_qm3FMo&_nc_ohc=PEupjhNFmOUQ7kNvgF5O3PG&_nc_oc=AdicZW_U-DN8PjgiadDbUveYUCIVXpkeEAcojMfotxKDp2qWLATRapRf1QuNKMQTBZWcB0eBC3EZ90glJ2TlVupz&_nc_zt=23&_nc_ht=scontent.fphs2-1.fna&_nc_gid=AXZKbt3pY0pkVIXTEYLlUUt&oh=00_AYBy8b4L1l8AP_Qwq_H9vZyhL8nyQrAE0dQIkPE9hIbuMg&oe=679F2B58",
    alt: "Slide 1",
  },
  {
    id: 2,
    src: "https://scontent.fbkk9-3.fna.fbcdn.net/v/t39.30808-6/453845854_492421013368778_2095123251518765907_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEQOeqTACp2b6aY6U64G9mWE1GZYgkgtOcTUZliCSC054BnH6Ccyn2ycy8qHf2QHxXdfWvkx4Gbp8EWFnqodHb7&_nc_ohc=29yuuWoZxgcQ7kNvgH3uBg6&_nc_oc=Adj6QagrdZHmg-2-7ywj0jWOMuADCCUqf-zeHuRj7OqslONJbfUZtxUdbfIy3JKqSDE&_nc_zt=23&_nc_ht=scontent.fbkk9-3.fna&_nc_gid=AmqlvE5ARIHpOvVtZzMQLad&oh=00_AYBBwzHxHzuqn5g1-cxX7LiIeoaCar1gougeAkL6V1Wl2Q&oe=679F84DC",
    alt: "Slide 2",
  },
  {
    id: 3,
    src: "https://scontent.fbkk8-2.fna.fbcdn.net/v/t39.30808-6/475188337_612423941368484_6158204649151793185_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHYHLzRHEvMFX0IjB6qDXft1aEhsi8nw23VoSGyLyfDbedoo-rJZJihYE7T4R9JbvKdxOZOmKV08ov5PTVfjOZO&_nc_ohc=Z5XylcTNwH8Q7kNvgEpZaTr&_nc_oc=AdiLYHz727pOa2RxXE8pn-_sxzA49D3jdJsHr_Ynn1b7zZ0nhaJUo9ixnFq0D_CAVC0&_nc_zt=23&_nc_ht=scontent.fbkk8-2.fna&_nc_gid=ATQnvQPFPeMDPKTmEH_nQlM&oh=00_AYBLFG4vdIJUu2kdWX7triyV_nASEqSCG0uciPun3Y0qtA&oe=679F6C7E",
    alt: "Slide 3",
    caption: "",
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
    <>
      {/* ✅ ImageSlider (แสดงรูปสไลด์) */}
      <div className="relative w-full max-w-full md:max-w-[90%] xl:max-w-[93.5%] mx-auto mt-5 mb-5 px-2 lg:px-6">
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          {/* รูปสไลด์ */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((image) => (
              <div key={image.id} className="flex-none w-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-[550px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <BrandSlider />
    </>
  );
};

export default ImageSlider;
