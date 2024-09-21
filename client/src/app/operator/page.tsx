import Card from "./buses/components/Card";
import Search from "./buses/components/Search";
import SortButton from "./buses/components/SortButton";
import Nav from "./components/Nav";

const page = () => {
  return (
    <>
      <Nav />
      <div className="pt-4 pb-8 px-6 sm:px-8 md:px-10 lg:px-16">
        <div className="pb-10 flex flex-col items-end gap-4 md:gap-0 md:flex-row md:justify-between md:items-center lg:grid lg:grid-cols-5 lg:justify-items-center">
          <div className="col-span-1 hidden lg:block"></div>
          <Search className="col-span-3" />
          <SortButton className="ms-8 col-span-1 justify-self-end" />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
};

export default page;
