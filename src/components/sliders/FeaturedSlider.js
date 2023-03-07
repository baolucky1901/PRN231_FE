import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, A11y, Autoplay } from "swiper";
import { useState, useEffect } from "react";

import "swiper/scss";
import "swiper/scss/autoplay";
import "swiper/scss/pagination";
import "swiper/scss/effect-coverflow";

const FeaturedSlider = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://localhost:44301/api/books/cus/books?page=1&pageSize=20"
      );
      const jsonData = await response.json();
      setData(jsonData.data);
    };
    fetchData();
  }, []);
  // const featuredProducts = productsData.filter(item => item.tag === 'featured-product');

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
      className="featured_swiper"
    >
      {data.map((item) => {
        const formattedPrice = item.price?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        return (
          <SwiperSlide key={item.id} className="featured_slides">
            <div className="featured_title">{item.name}</div>
            <figure className="featured_img">
              <Link to={`/product-details/${item.id}`}>
                <img src={item.imgPath} alt="" />
              </Link>
            </figure>
            <h2 className="products_price">{formattedPrice}</h2>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default FeaturedSlider;
