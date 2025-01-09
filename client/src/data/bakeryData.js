// src/data/bakeryData.js

const bakeries = [
    {
      id: 1,
      name: 'Sweet Delights Bakery',
      description:
        'Welcome to Sweet Delights Bakery! We are a family-owned bakery specializing in artisanal breads, pastries, and custom cakes made with love and the finest ingredients.',
      rating: 4.5,
      imageUrl: '/images/sweet-delights.jpg',
      products: [
        {
          id: 101,
          title: 'Chocolate Fudge Cake',
          description: 'Rich and moist chocolate cake topped with creamy fudge icing.',
          imageUrl: '/images/chocolate-fudge-cake.jpg',
        },
        {
          id: 102,
          title: 'Lemon Tart',
          description: 'Tangy lemon tart with a buttery crust, topped with fresh whipped cream.',
          imageUrl: '/images/lemon-tart.jpg',
        },
        {
          id: 103,
          title: 'Cinnamon Roll',
          description: 'Soft and fluffy cinnamon rolls drizzled with vanilla glaze.',
          imageUrl: '/images/cinnamon-roll.jpg',
        },
      ],
    },
    {
      id: 2,
      name: 'Artisan Breads Co.',
      description:
        'Artisan Breads Co. offers freshly baked breads made with traditional methods and the highest quality ingredients.',
      rating: 4.2,
      imageUrl: '/images/artisan-breads.jpg',
      products: [
        {
          id: 201,
          title: 'Sourdough Bread',
          description: 'Traditional sourdough bread with a crispy crust and soft interior.',
          imageUrl: '/images/sourdough-bread.jpg',
        },
        {
          id: 202,
          title: 'Whole Wheat Bread',
          description: 'Nutty and wholesome whole wheat bread, perfect for sandwiches.',
          imageUrl: '/images/whole-wheat-bread.jpg',
        },
        {
          id: 203,
          title: 'Baguette',
          description: 'Classic French baguette with a crispy crust and chewy interior.',
          imageUrl: '/images/baguette.jpg',
        },
      ],
    },
    {
      id: 3,
      name: 'Cupcake Heaven',
      description:
        'Cupcake Heaven serves delicious cupcakes with a variety of flavors and toppings.',
      rating: 4.8,
      imageUrl: '/images/cupcake-heaven.jpg',
      products: [
        {
          id: 301,
          title: 'Vanilla Cupcake',
          description: 'Classic vanilla cupcake with buttercream frosting.',
          imageUrl: '/images/vanilla-cupcake.jpg',
        },
        {
          id: 302,
          title: 'Red Velvet Cupcake',
          description: 'Moist red velvet cupcake topped with cream cheese frosting.',
          imageUrl: '/images/red-velvet-cupcake.jpg',
        },
        {
          id: 303,
          title: 'Salted Caramel Cupcake',
          description: 'Rich chocolate cupcake with salted caramel filling and frosting.',
          imageUrl: '/images/salted-caramel-cupcake.jpg',
        },
      ],
    },
    {
      id: 4,
      name: 'Pastry Palace',
      description:
        'Pastry Palace offers a variety of classic pastries, from croissants to éclairs, freshly made every day.',
      rating: 4.6,
      imageUrl: '/images/pastry-palace.jpg',
      products: [
        {
          id: 401,
          title: 'Croissant',
          description: 'Buttery and flaky croissant, perfect for breakfast.',
          imageUrl: '/images/croissant.jpg',
        },
        {
          id: 402,
          title: 'Éclair',
          description: 'Choux pastry filled with vanilla cream and topped with chocolate glaze.',
          imageUrl: '/images/eclair.jpg',
        },
        {
          id: 403,
          title: 'Apple Danish',
          description: 'Danish pastry topped with spiced apples and a hint of cinnamon.',
          imageUrl: '/images/apple-danish.jpg',
        },
      ],
    },
];

export default bakeries;
