import { playfair_display, plus_jakarta_sans } from "@/app/ui/fonts";
import NavBar from "@/app/ui/navbar";
import RecipeSection from "@/app/ui/recipe_section";
import "./banner_style.css";

export default function HomePageClient({ img: banner_img }: { img: string }) {
  const css = `
.banner-bg::before {
background: url(/banner/${banner_img});
background-repeat: no-repeat;
background-position: center;
background-size: cover;
} 
`;

  return (
    <div>
      <NavBar />
      <style>{css}</style>
      <div className="h-[35vh] md:h-[50vh] w-full flex justify-center items-center banner-bg">
        <div className="text-nowrap text-5xl md:text-6xl lg:text-8xl text-white">
          <span className={`${playfair_display.className}`}>Recipes.</span>
          <span className={`${plus_jakarta_sans.className}`}>com</span>
        </div>
      </div>
      <div className="py-6 flex flex-col gap-5">
        <RecipeSection title="Popular" fetch="top_desc" />
        <RecipeSection title="Easy" fetch="tag_Easy_date-added_desc" />
        <RecipeSection title="Recent Addition" fetch="date-added_" />
      </div>
    </div>
  );
}
