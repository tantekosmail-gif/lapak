import { CollectionCard } from "../components/ui/card/CollectionCard";

const collections = [
  {
    id: 1,
    name: "Absolute Essential Oils",
    description: "High-quality essential oils for aromatherapy and wellness.",
    url: "/collections/absolute-essential-oils",
  },
  {
    id: 2,
    name: "Accessories",
    description: "Stylish accessories to complement your wellness routine.",
    url: "/collections/accessories",
  },
  {
    id: 3,
    name: "Aromatherapy Vaporizers",
    description: "Effective vaporizers for diffusing essential oils.",
    url: "/collections/aromatherapy-vaporizers",
  },
  {
    id: 4,
    name: "Australian Carrier Oils",
    description: "Pure carrier oils sourced from Australia.",
    url: "/collections/australian-carrier-oils",
  },
  {
    id: 5,
    name: "Australian Essential Oils",
    description: "Premium essential oils from Australian plants.",
    url: "/collections/australian-essential-oils",
  },
];

const page = () => (
  <div className="container mx-auto py-8 space-y-6">
    <h1 className="uppercase font-bold text-xl">shop by collection</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          name={collection.name}
          description={collection.description}
          url={collection.url}
        />
      ))}
    </div>
  </div>
);

export default page;
