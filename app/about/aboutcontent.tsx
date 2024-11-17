"use client";

import { useRouter } from "next/navigation";

export default function AboutContent() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="mt-5 w-full px-5 flex items-center text-blue-600">
        <span className="material-symbols-rounded">arrow_back</span>
        <span
          className="hover:underline ml-2 cursor-pointer"
          onClick={() => router.back()}
        >
          Back
        </span>
      </div>
      <div className="max-w-screen-md w-full p-4 [&>p]:mt-6 mb-10">
        <h1 className="text-6xl mb-3"> About </h1>
        <p>
          This is a CBSE Class 12 Boards Project submission for computer
          science. The project is a Recipe website intended for the general
          public.
        </p>
        <p>
          The project is divided into two major sections, frontend and the
          backend, the frontend is responsible for the User Interface and client
          side actions whereas the backend is responsible for the database,
          image storage, and REST API.
        </p>
        <p>
          The frontend is made using Next.js, a javascript/typescript based
          frontend framework that uses React.js at its core. The frontend
          utilises Typescript, Javascript, HTML, CSS, Tailwind CSS, React JS,
          Next JS, ESLint, Material Symbols Rounded and Google Fonts API. All
          the interface components and parts of the UI are originally designed,
          and were made using a designing tool namely Figma. The frontend also
          implements responsive design so it is capable of working on varying
          display sizes.
        </p>
        <p>
          The backend is made using Python, Flask, pymysql, waiteress server,
          werkzeug, requests and some in-house ORM. The backend server can
          connect to either MySQL or equivalent MariaDB server. The backend also
          supports incremental database migrations. The backend server also
          communicates with Arli AI API to generate recipes using LLMs, The LLM
          used for generating content on this website is LLama-3.1-8B-Instruct.
        </p>
        <p>
          The backend is connected to the frontend using the HTTP protocol and
          browser fetch API. The frontend is loaded asynchronously also
          utilising loading screens and placeholder items. The images are stored
          in two sizes, one for thumbnail and one for the fullscreen to optimise
          the website loading time.
        </p>
        <p>
          The backend tracks popularity of recipes by counting how many times a
          page is visited or a recipe is fetched. The backend also supports an
          in-house SQL based search engine to build SQL statements on the fly.
        </p>
        <p>
          The dashboard/admin panel supports token based authorization, the
          frontend API automatically revalidates token. The backend and the
          frontend can be configured via .env files. They can also be used as a
          docker image
        </p>
      </div>
    </div>
  );
}
