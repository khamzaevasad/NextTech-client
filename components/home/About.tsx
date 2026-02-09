import Image from "next/image";

function About() {
  return (
    <div className="my-8">
      <h2 className="text-4xl font-semibold mt-6">About</h2>
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="w-full lg:w-1/2 relative aspect-square lg:aspect-auto lg:h-125">
          <Image
            src="/about.webp"
            alt="about-image"
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="w-full lg:w-1/2 space-y-4">
          <h3 className="text-2xl font-semibold">about us</h3>
          <p className="text-muted-foreground leading-relaxed">
            Next Tech is a modern technology marketplace platform that connects
            sellers and customers in the field of computer hardware,
            electronics, and digital devices. We provide a unified ecosystem
            where sellers can create their own stores and offer products, while
            customers can easily discover, compare, and purchase technology
            products with confidence.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our platform is built around a clear role-based system: Seller,
            Customer, and Admin. Sellers are empowered with tools to manage
            stores, products, and orders. Customers enjoy a seamless, secure,
            and user-friendly shopping experience. Administrators oversee
            platform operations, ensuring quality control, moderation, and
            system stability.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Next Tech collaborates with trusted vendors and partners, placing
            strong emphasis on product quality, transparent transactions, and
            reliable service. We support multiple payment methods and delivery
            options to ensure convenience and accessibility for all users.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
