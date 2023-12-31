import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
    clearErrors,
    getProductDetails,
    newReview,
} from "../../actions/productAction";
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartActions";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ProductDetails = ({ match }) => {
    const history = useHistory()
    const dispatch = useDispatch();
    const alert = useAlert();

    const { product, loading, error } = useSelector(
        (state) => state.productDetails
    );

    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
    );
    const user = useSelector(state => state.user.user)
    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const increaseQuantity = () => {
        if (product.Stock <= quantity) return;

        const qty = quantity + 1;
        setQuantity(qty);
    };

    const decreaseQuantity = () => {
        if (1 >= quantity) return;

        const qty = quantity - 1;
        setQuantity(qty);
    };

    const addToCartHandler = () => {
        if (!user) {
            history.push('/login')
            return
        }
        dispatch(addItemsToCart(match.params.id, quantity));
        alert.success("Đã thêm vào giỏ hàng");
    };

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", match.params.id);

        dispatch(newReview(myForm));

        setOpen(false);
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Đánh giá sản phẩm thành công!");
            dispatch({ type: NEW_REVIEW_RESET });
        }
        dispatch(getProductDetails(match.params.id));
    }, [dispatch, match.params.id, error, alert, reviewError, success]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={`${product.name} - Mobile Store`} />
                    <div className="ProductDetails">
                        <div>
                            <Carousel>
                                {product.images &&
                                    product.images.map((item, i) => (
                                        <img
                                            className="CarouselImage"
                                            key={i}
                                            src={item.url}
                                            alt={`${i} Slide`}
                                        />
                                    ))}
                            </Carousel>
                        </div>

                        <div>
                            <div className="detailsBlock-1">
                                <h2>{product.name}</h2>
                                <p>Sản phẩm # {product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <Rating {...options} />
                                <span className="detailsBlock-2-span">
                                    {" "}
                                    ({product.numOfReviews} Đánh giá)
                                </span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`${product.price}$`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input readOnly type="number" value={quantity} />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>
                                    <button
                                        disabled={product.Stock < 1 ? true : false}
                                        onClick={addToCartHandler}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>

                                <p>
                                    Tình trạng sản phẩm:
                                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                        {product.Stock < 1 ? " Tạm thời hết sản phẩm. Xin lỗi quý khách!" : " Sản phẩm vẫn còn"}
                                    </b>
                                </p>
                            </div>

                            <div className="detailsBlock-4">
                                Thông tin sản phẩm : <p>{product.description}</p>
                            </div>

                            <button onClick={submitReviewToggle} className="submitReview">
                                Đánh giá sản phẩm
                            </button>
                        </div>
                    </div>

                    <h3 className="reviewsHeading">Tất cả bình luận</h3>

                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Đăng tải</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />

                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={submitReviewToggle} color="secondary">
                                Hủy
                            </Button>
                            <Button onClick={reviewSubmitHandler} color="primary">
                                Bình luận
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {product.reviews && product.reviews[0] ? (
                        <div className="reviews">
                            {product.reviews &&
                                product.reviews.map((review) => (
                                    <ReviewCard key={review._id} review={review} />
                                ))}
                        </div>
                    ) : (
                        <p className="noReviews">Không có đánh giá</p>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;