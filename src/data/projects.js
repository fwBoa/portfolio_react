// Liste des projets du portfolio 
// a mettre en commentaires 
export const projects = [
  {
    id: 1,
    title: "test",
    description: "Plateforme ",
    shortDescription: "",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    tags: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/",
    demo: "https://demo-ecommerce.com",
    featured: true,
    code: `// Exemple de composant ProductCard
import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">{product.price}€</p>
      <button onClick={() => onAddToCart(product)}>
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;`
  }
];

//   {
//     id: 2,
//     title: "Dashboard Analytics",
//     description: "Tableau de bord interactif pour visualiser des données en temps réel avec graphiques et statistiques.",
//     shortDescription: "Visualisation de données en temps réel",
//     image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
//     tags: ["React", "D3.js", "WebSocket", "TailwindCSS"],
//     github: "https://github.com/username/analytics-dashboard",
//     demo: "https://demo-dashboard.com",
//     featured: true,
//     code: `// Hook personnalisé pour les données en temps réel
// import { useState, useEffect } from 'react';

// const useRealtimeData = (endpoint) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const ws = new WebSocket(endpoint);
    
//     ws.onmessage = (event) => {
//       const newData = JSON.parse(event.data);
//       setData(prev => [...prev, newData]);
//       setLoading(false);
//     };

//     return () => ws.close();
//   }, [endpoint]);

//   return { data, loading };
// };

// export default useRealtimeData;`
//   },

//   {
//     id: 3,
//     title: "Réseau Social Minimaliste",
//     description: "Application de réseau social avec authentification, posts, likes et commentaires.",
//     shortDescription: "Plateforme sociale épurée",
//     image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
//     tags: ["React", "Firebase", "Context API", "CSS Modules"],
//     github: "https://github.com/username/social-network",
//     demo: "https://demo-social.com",
//     featured: false,
//     code: `// Context pour l'authentification
// import React, { createContext, useState, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = async (email, password) => {
//     // Logique de connexion
//     const userData = await authenticateUser(email, password);
//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);`
//   },
//   {
//     id: 4,
//     title: "Application Météo",
//     description: "Application météo avec prévisions sur 7 jours et géolocalisation.",
//     shortDescription: "Prévisions météo interactives",
//     image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
//     tags: ["React", "OpenWeather API", "Geolocation"],
//     github: "https://github.com/username/weather-app",
//     demo: "https://demo-weather.com",
//     featured: false,
//     code: `// Service API Météo
// const API_KEY = 'your_api_key';
// const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// export const getWeatherByCity = async (city) => {
//   const response = await fetch(
//     \`\${BASE_URL}/weather?q=\${city}&appid=\${API_KEY}&units=metric\`
//   );
//   return response.json();
// };

// export const getWeatherByCoords = async (lat, lon) => {
//   const response = await fetch(
//     \`\${BASE_URL}/weather?lat=\${lat}&lon=\${lon}&appid=\${API_KEY}&units=metric\`
//   );
//   return response.json();
// };`
//   },
//   {
//     id: 5,
//     title: "Gestionnaire de Tâches",
//     description: "Application de gestion de tâches avec drag & drop, catégories et deadlines.",
//     shortDescription: "To-do list avancée",
//     image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
//     tags: ["React", "DnD Kit", "LocalStorage", "Framer Motion"],
//     github: "https://github.com/username/task-manager",
//     demo: "https://demo-tasks.com",
//     featured: false,
//     code: `// Composant Task avec drag & drop
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const Task = ({ task }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition
//   } = useSortable({ id: task.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <h4>{task.title}</h4>
//       <p>{task.description}</p>
//     </div>
//   );
// };`
//   }
// ];
