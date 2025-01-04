import PropTypes from "prop-types";
import { Slider } from "../components/ui/slider";
import { useEffect, useState } from "react";
import Card from "../components/card";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import LoadingGlass from "../components/loading";

function Shop({
  products,
  selectedGenres,
  setSelectedGenres,
  handleLikeBtnClick,
  wishList,
}) {
  const [sliderValues, setSliderValues] = useState({
    min: 0,
    max: 0,
  });
  const [range, setRange] = useState([sliderValues?.min, sliderValues?.max]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleRangeChange = (value) => {
    setRange(value);
  };

  useEffect(() => {
    if (!selectedGenres.length && products?.length) {
      setSelectedGenres([...new Set(products.map((product) => product.genre))].map(genre => ({ title: genre })));
    }
  }, [products, selectedGenres, setSelectedGenres]);

  useEffect(() => {
    if (products?.length) {
      setFilteredProducts(products);
    }
  }, [products]);

  useEffect(() => {
    if (products?.length) {
      setSliderValues(
        products.reduce(
          (acc, curr) =>
            curr.originalPrice > acc.max
              ? { ...acc, max: curr.originalPrice }
              : acc,
          { min: 0, max: 0 }
        )
      );
    }
  }, [products]);

  useEffect(() => {
    let newProducts = products.filter(
      (product) =>
        (product.discountedPrice >= range[0] ||
          product.originalPrice >= range[0]) &&
        (product.discountedPrice <= range[1] ||
          product.originalPrice <= range[1])
    );

    newProducts = newProducts.filter(
      (pr) =>
        selectedGenres.findIndex(
          (gr) => gr.title.toUpperCase() === pr.genre.toUpperCase()
        ) !== -1
    );

    setFilteredProducts(newProducts);
  }, [range, selectedGenres, products]);

  useEffect(() => {
    setRange([sliderValues.min, sliderValues.max]);
  }, [sliderValues]);

  const handleGenreChange = (title) => {
    const currentGrIdx = selectedGenres.findIndex((gr) => gr.title === title);
    let updatedGenres = [...selectedGenres];
    if (currentGrIdx === -1) {
      updatedGenres.push({ title });
    } else {
      updatedGenres.splice(currentGrIdx, 1);
    }
    setSelectedGenres(updatedGenres);
  };

  const onClear = () => {
    setSelectedGenres([...new Set(products.map((product) => product.genre))].map(genre => ({ title: genre })));
    setRange([0, sliderValues.max]);
  };

  const sortHighToLow = () => {
    const newSortData = [...products].sort(
      (a, b) => b.discountedPrice - a.discountedPrice
    );
    setFilteredProducts(newSortData);
  };

  const sortLowToHigh = () => {
    const newSortData = [...products].sort(
      (a, b) => a.discountedPrice - b.discountedPrice
    );
    setFilteredProducts(newSortData);
  };

  const filterByRating = (rating) => {
    const filtered = products.filter((product) => product.rating >= rating);
    setFilteredProducts(filtered);
  };

  return (
    <div className="px-16 flex flex-col my-10 mt-28 bg-pink-50 bg-opacity-80 shadow-md text-black backdrop-blur-lg">
      <h1 className="text-3xl text-center text-black my-5">
        Showing {filteredProducts.length} products
      </h1>
      <div className="flex gap-10">
        <div className="flex flex-col w-5/3 space-y-8">
          {/* Clear Filters Button */}
          <Button
            onClick={onClear}
            className="mb-5 bg-pink-500 hover:bg-pink-600"
          >
            Clear Filter
          </Button>

          {/* Price Range Slider */}
          <div>
            <h3 className="mt-4 text-lg font-semibold">Price Range</h3>
            <Slider
              defaultValue={[sliderValues.min, sliderValues.max]}
              max={sliderValues?.max}
              min={0}
              step={0.5}
              value={range}
              onValueChange={handleRangeChange}
              formatLabel={(value) => `${value} `}
            />
          </div>

          {/* Categories Filter */}
          <div>
            <h3 className="text-lg font-semibold">Categories</h3>
            <div className="mt-2 space-y-2">
              {[...new Set(products.map((product) => product.genre))].map((genre) => (
                <div className="flex items-center space-x-2" key={genre}>
                  <Checkbox
                    id={genre}
                    checked={selectedGenres.findIndex((gr) => gr.title === genre) !== -1}
                    onCheckedChange={() => handleGenreChange(genre)}
                  />
                  <Label
                    htmlFor={genre}
                    className="text-sm font-medium text-black leading-none"
                  >
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sorting Options */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Sort By</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="A-Z"
                  id="r1"
                  name="radio"
                  onChange={sortLowToHigh}
                />
                <label htmlFor="r1">Price - Low to High</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="Z-A"
                  id="r2"
                  name="radio"
                  onChange={sortHighToLow}
                />
                <label htmlFor="r2">Price - High to Low</label>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((star) => (
                <div className="flex items-center space-x-2" key={star}>
                  <input
                    type="radio"
                    id={`rating-${star}`}
                    name="stars"
                    onChange={() => filterByRating(star)}
                  />
                  <label htmlFor={`rating-${star}`}>{star} stars or above</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex justify-around mt-8 gap-5 flex-wrap w-5/6">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <Card
                key={product._id}
                {...product}
                handleLikeBtnClick={handleLikeBtnClick}
                isLiked={wishList?.findIndex((wishItem) => wishItem._id === product._id) === -1}
              />
            ))
          ) : (
            <div className="my-28">
              <LoadingGlass />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Shop.propTypes = {
  sliderValues: PropTypes.object,
  setSliderValues: PropTypes.func,
  products: PropTypes.array,
  selectedGenres: PropTypes.array,
  setSelectedGenres: PropTypes.func,
  handleLikeBtnClick: PropTypes.func,
  wishList: PropTypes.array,
};

export default Shop;
