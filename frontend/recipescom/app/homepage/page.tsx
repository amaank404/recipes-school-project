import {playfair_display, plus_jakarta_sans} from "@/app/ui/fonts";
import './banner_style.css';
import NavBar from "@/app/ui/navbar";
import RecipeSection from "@/app/ui/recipe_section";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Recipes.com",
};

export default function HomePage () {
    return (
        <div>
            <NavBar />
            <div className="h-[35vh] md:h-[50vh] w-full flex justify-center items-center banner-bg">
                <div className="text-nowrap text-5xl md:text-6xl lg:text-8xl text-white">
                    <span className={`${playfair_display.className}`}>Recipes.</span>
                    <span className={`${plus_jakarta_sans.className}`}>com</span>
                </div>
            </div>
            <div className="py-6 flex flex-col gap-5">
                <RecipeSection title="Popular" fetch="popular" />
                <RecipeSection title="Easy" fetch="easy" />
                <RecipeSection title="Not Found" fetch="not found" />
            </div>
        </div>
    )
}