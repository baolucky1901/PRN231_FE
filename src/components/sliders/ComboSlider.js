import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, A11y, Autoplay } from "swiper";
import { useState, useEffect } from "react";

import "swiper/scss";
import "swiper/scss/autoplay";
import "swiper/scss/pagination";
import "swiper/scss/effect-coverflow";

const ComboSlider = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://localhost:44301/api/combobooks?page=1&pageSize=20"
      );
      const jsonData = await response.json();
      setData(jsonData.data);
    };
    fetchData();
  }, []);
  // const comboProducts = productsData.filter(item => item.tag === 'combo-product');

  return (
    <Swiper
      modules={[EffectCoverflow, Pagination, A11y, Autoplay]}
      loop={true}
      speed={400}
      spaceBetween={100}
      slidesPerView={"auto"}
      pagination={{ clickable: true }}
      effect={"coverflow"}
      centeredSlides={true}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 70,
        modifier: 3,
        slideShadows: false,
      }}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      breakpoints={{
        768: {
          slidesPerView: 2,
          spaceBetween: 200,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 250,
        },
      }}
      className="combo_swiper"
    >
      {data.map((item) => {
        const formattedPrice = item.priceReduction?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        return (
          <SwiperSlide key={item.id} className="combo_slides">
            <div className="combo_title">{item.name}</div>
            <figure className="combo_img">
              <Link to={`/product-combo-details/${item.id}`}>
                <img src="https://tse3.mm.bing.net/th?id=OIP.agc6rzHESnk7CBUxOLlPtAHaFj&pid=Api&P=0" alt="product-img" />
              </Link>
            </figure>
            <h2 className="products_price">{formattedPrice}</h2>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ComboSlider;
