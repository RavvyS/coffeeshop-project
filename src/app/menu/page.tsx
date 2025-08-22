import { Header } from '@/components/Header';

export default function MenuPage() {
  const menuItems = [
    { name: 'Espresso', price: '$3.00', description: 'Rich and bold single shot' },
    { name: 'Cappuccino', price: '$4.50', description: 'Perfect balance of espresso and foam' },
    { name: 'Latte', price: '$5.00', description: 'Smooth espresso with steamed milk' },
    { name: 'Americano', price: '$3.75', description: 'Espresso with hot water' },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      
      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-coffee-900 text-center mb-12">
            Our Menu
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {menuItems.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <span className="text-coffee-500 font-bold">{item.price}</span>
                </div>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
