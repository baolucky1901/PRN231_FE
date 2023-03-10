import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdStar, IoMdCheckmark } from "react-icons/io";
import useDocTitle from "../hooks/useDocTitle";
import useActive from "../hooks/useActive";
import cartContext from "../contexts/cart/cartContext";
import productsData from "../data/productsData";
import SectionsHead from "../components/common/SectionsHead";
import RelatedSlider from "../components/sliders/RelatedSlider";
import ProductSummaryCombo from "../components/product/ProductSummaryCombo";
import Services from "../components/common/Services";
import { UseAuth } from "../contexts/auth/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import commonContext from "../contexts/common/commonContext";

const ProductDetails = () => {
  useDocTitle("Book Combo Details");

  const { user } = UseAuth();
  // console.log("User Header: ", user);

  const { toggleForm } = useContext(commonContext);

  const { handleActive, activeClass } = useActive(0);

  const { addItem } = useContext(cartContext);

  const { productId } = useParams();

  // here the 'id' received has 'string-type', so converting it to a 'Number'
  const prodId = parseInt(productId);

  // showing the Product based on the received 'id'
  const product = productsData.find((item) => item.id === prodId);

  const { category, ratings, rateCount } = product;

  const [data, setData] = useState({});
  const [image, setImage] = useState([]);
  const [ebookData, setEbookData] = useState({});

  const { id, name, priceReduction, description } = data;

  const subDescription = description?.substring(0, 258);

  const [previewImg, setPreviewImg] = useState(image[0]);

  const [selectedValue, setSelectedValue] = useState("");

  const handleOption = (event) => {
    setSelectedValue(event.target.value);
  };

  // api select button book
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://localhost:44301/api/combobooks/combobook/${prodId}`
      );
      const data = await res.json();
      setData(data.data);

    //   const resImage = await fetch(
    //     `https://localhost:44301/api/book-images/book-image/book/${prodId}`
    //   );
    //   const dataResImage = await resImage.json();
    //   setImage(dataResImage.data);
    //   setPreviewImg(dataResImage.data[0].imgPath);

    //   const resDataEbook = await fetch(
    //     `https://localhost:44301/api/ebooks/ebook/book/${prodId}`
    //   );
    //   const dataResDataEbook = await resDataEbook.json();
    //   setEbookData(dataResDataEbook.data);
    };

    fetchData();
  }, []);

  // console.log("Ebook Data: ", ebookData);

  // handling Add-to-cart
  const handleAddItem = () => {
    if (Object.keys(user).length === 0) {
      toggleForm(true);
    } else if (selectedValue === "") {
      toast.warning("You must choose type of book!");
      // alert("You must choose type of book!");
    } else {
      addItem({
        ...data,
        cateItem: selectedValue,
        previewImg: previewImg,
        quantity: 1,
        price: selectedValue === "E-Book" ? ebookData.price : data.price,
        id: selectedValue === "E-Book" ? ebookData.ebookId : data.id,
      });
    }
  };

  // setting the very-first image on re-render
  useEffect(() => {
    if (image.length !== 0) {
      setPreviewImg(image[0].imgPath);
      handleActive(0);
    }
  }, []);

  // handling Preview image
  const handlePreviewImg = (i) => {
    // setPreviewImg(image[i].imgPath);
    setPreviewImg(image[i].imgPath);
    handleActive(i);
  };

  return (
    <>
      <section id="product_details" className="section">
        <div className="container">
          <div className="wrapper prod_details_wrapper">
            {/*=== Product Details Left-content ===*/}
            <div className="prod_details_left_col">
              <div className="prod_details_tabs">
                {image?.map((img, i) => (
                  <div
                    key={i}
                    className={`tabs_item ${activeClass(i)}`}
                    onClick={() => handlePreviewImg(i)}
                  >
                    <img src={img.imgPath} alt="product-img" />
                    {/* <img src="https://images.thenile.io/r1000/9781593279509.jpg" alt="product-img" /> */}
                  </div>
                ))}
              </div>
              <figure className="prod_details_img">
                {/* <img src={previewImg} alt="product-img" /> */}
                <img src="https://tse3.mm.bing.net/th?id=OIP.agc6rzHESnk7CBUxOLlPtAHaFj&pid=Api&P=0" alt="product-img" />
              </figure>
            </div>

            {/*=== Product Details Right-content ===*/}
            <div className="prod_details_right_col">
              <h1 className="prod_details_title">{name}</h1>
              {/* <h4 className="prod_details_info">{categoryName}</h4> */}

              <h5 className="prod_details_desc">{subDescription}...</h5>

              <div className="prod_details_ratings">
                <span className="rating_star">
                  {[...Array(rateCount)].map((_, i) => (
                    <IoMdStar key={i} />
                  ))}
                </span>
                <span>|</span>
                <Link to="*">{ratings} Ratings</Link>
              </div>

              <div className="separator"></div>

              <div className="prod_details_price">
                <div className="price_box">
                  <h2 className="price">{priceReduction} &nbsp;</h2>
                </div>

                <div className="badge">
                  <span>
                    <IoMdCheckmark /> In Stock
                  </span>
                </div>
              </div>

              <div className="separator"></div>

              <div className="prod_details_offers">
                <h4>Name of each book</h4>
                    <ul>
                        <li>Eloquent Javascript</li>
                        <li>Don’t Make Me Think, Revisited: A Common Sense Approach to Web Usability</li>
                    </ul>
              </div>
              <div className="separator"></div>
              <div className="prod_details_buy_btn">
                <button type="button" className="btn" onClick={handleAddItem}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductSummaryCombo {...data} />

      <section id="related_products" className="section">
        <div className="container">
          <SectionsHead heading="Related Products" />
          <RelatedSlider category={category} />
        </div>
      </section>

      <Services />
      <ToastContainer />
    </>
  );
};

export default ProductDetails;
