import Nav from "@/components/Nav";
import { useState } from "react";

export const getServerSideProps = async () => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": process.env.RAPID_API_HOST,
    },
  };

  const offset = Math.floor(Math.random() * 198);

  const res = await fetch(
    `https://wft-geo-db.p.rapidapi.com/v1/geo/countries?limit=8&offset=${offset}`,
    options
  );
  const countries = await res.json();
  return { props: { data: countries.data } };
};

export default function Page({ data }) {
  const [countries, setCountries] = useState(data);

  const handleSortAsc = () => {
    const sortedCountries = [...countries];
    sortedCountries.sort((a, b) => a.name > b.name);
    setCountries(sortedCountries);
  };

  const handleSortDesc = () => {
    const sortedCountries = [...countries];
    sortedCountries.sort((a, b) => a.name < b.name);
    setCountries(sortedCountries);
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-green-500 my-4 text-center">
          List of countries
        </h1>
        <div className="border border-slate-600 inline-block p-2">
          Sort by country name:
          <button
            onClick={handleSortAsc}
            className="bg-slate-600 text-white rounded px-3 py-2 m-2 hover:text-green-500"
          >
            ASC
          </button>
          <button
            onClick={handleSortDesc}
            className="bg-slate-600 text-white rounded px-3 py-2 m-2 hover:text-green-500"
          >
            DESC
          </button>
        </div>
        {countries.map((country) => (
          <div key={country.code} className="flex flex-col items-center mb-4">
            <p className="text-left">{`${country.code} - ${country.name}`}</p>
            <p>Currency code: {country.currencyCodes[0]}</p>
          </div>
        ))}
      </div>
    </>
  );
}
