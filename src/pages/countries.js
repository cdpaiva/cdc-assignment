import Nav from "@/components/Nav";

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
    `https://wft-geo-db.p.rapidapi.com/v1/geo/countries?offset=${offset}`,
    options
  );
  const countries = await res.json();
  return { props: { countries } };
};

export default function Page({ countries }) {
  console.log(countries.data);
  console.log("first render");

  return (
    <>
      <Nav />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-green-500 my-4 text-center">
          List of countries
        </h1>
        {countries.data.map((country) => (
          <div key={country.code} className="flex flex-col items-center mb-4">
            <p className="text-left">{`${country.code} - ${country.name}`}</p>
            <p>Currency code: {country.currencyCodes[0]}</p>
          </div>
        ))}
      </div>
    </>
  );
}
