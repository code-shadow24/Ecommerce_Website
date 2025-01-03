"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export function CategorySection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const categoryData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/category/getallcategory"
        );
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.log("Error occurred while fetching categories", error);
      }
    };

    categoryData();
  }, []);

  return (
    <div className="bg-slate-300">
      <div className="bg-white text-black mx-[7px] h-[170px] flex items-center pt-[3px]">
        <div className="flex gap-7 mt-2 mb-2 h-[120px] text-center ml-[25px] cursor-pointer">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="w-[100px] h-[120px] flex items-center justify-center overflow-hidden rounded-full bg-blue-200 p-1">
                  <Image
                    key={index}
                    width={100}
                    height={100}
                    src={category.image}
                    alt={category.categoryName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p key={index} className="font-bold cursor-pointer">
                    {category.categoryName}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg font-bold text-center">No categories available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
