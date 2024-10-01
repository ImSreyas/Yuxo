import { Button } from "@/components/ui/button";
import Card from "./buses/components/Card";
import Search from "./buses/components/Search";
import SortButton from "./buses/components/SortButton";
import Nav from "./components/Nav";
import SubNav from "./buses/components/SubNav";

const page = () => {
  return (
    <>
      <Nav />
      <div className="pt-4 pb-8 px-6 sm:px-8 md:px-10 lg:px-16">
      <SubNav />
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
