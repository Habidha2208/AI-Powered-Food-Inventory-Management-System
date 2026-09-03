import { useEffect, useState } from "react";
import API from "../services/api";
import "./Dashboard.css";
function Dashboard() {
  const [foods, setFoods] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortOrder, setSortOrder] = useState("nearest");
  const [userName, setUserName] = useState("");
  const [shoppingItem, setShoppingItem] = useState("");
  const [shoppingList, setShoppingList] = useState(() => {
  const saved = localStorage.getItem("shoppingList");
  return saved ? JSON.parse(saved) : [];
});
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState("");
  const getFoods = async () => {
    try {
      const res = await API.get("/foods");
      setFoods(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRecipe = async () => {
  try {
    setLoadingRecipe(true);

    const ingredients = foods
  .filter(food => {

    const today = new Date();
    const expiry = new Date(food.expiryDate);

    today.setHours(0,0,0,0);
    expiry.setHours(0,0,0,0);

    return expiry >= today;

  })
  .map(food => food.name);

    const res = await API.post("/ai/recipe", {
      ingredients,
    });

    setRecipe(res.data.recipe);

  } catch (error) {
    console.log(error);
    alert("Failed to generate recipe");
  } finally {
    setLoadingRecipe(false);
  }
};
// Add Food
const addFood = async () => {
  try {
    await API.post("/foods/add", {
  name,
  quantity,
  category,
  expiryDate,
});

    setToast("✅ Food Added Successfully");

setTimeout(() => {
  setToast("");
}, 3000);
    setName("");
    setQuantity("");
    setCategory("");
    setExpiryDate("");

    getFoods();

  } catch (error) {
    console.log(error);
    setToast("❌ Error adding food");

setTimeout(() => {
  setToast("");
}, 3000);
  }
};

const updateFood = async () => {
  try {
    await API.put(`/foods/${editId}`, {
      name,
      quantity,
      category,
      expiryDate,
    });

    setToast("✅ Food Updated Successfully");

setTimeout(() => {
  setToast("");
}, 3000);
    setName("");
    setQuantity("");
    setCategory("");
    setExpiryDate("");

    setEditId(null);
    setIsEditing(false);

    getFoods();
  } catch (error) {
    console.log(error);
  }
};

const deleteFood = async (id) => {
  try {
    await API.delete(`/foods/${id}`);

    setToast("✅ Food Deleted Successfully");

    setTimeout(() => {
      setToast("");
    }, 3000);

    getFoods();
  } catch (error) {
    console.log(error);
    
    setToast("❌ Error deleting food");

    setTimeout(() => {
      setToast("");
    }, 3000);
  }
};
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }
  const name = localStorage.getItem("name");

  if (name) {
    setUserName(name);
  }

  getFoods();
  if (Notification.permission !== "granted") {
  Notification.requestPermission();
}
}, []);
const expiringFoods = foods.filter((food) => {
  const today = new Date();
  const expiry = new Date(food.expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const days = (expiry - today) / (1000 * 60 * 60 * 24);

  return days >= 0 && days <= 3;
});
useEffect(() => {

  if (Notification.permission !== "granted") return;

  const today = new Date().toDateString();

  const lastNotification = localStorage.getItem("lastNotification");

  if (lastNotification === today) return;

  const expiring = foods.filter(food => {

    const expiry = new Date(food.expiryDate);

    const now = new Date();

    expiry.setHours(0,0,0,0);
    now.setHours(0,0,0,0);

    const days =
      Math.ceil((expiry-now)/(1000*60*60*24));

    return days>=0 && days<=3;

  });

  const expired = foods.filter(food=>{

    const expiry=new Date(food.expiryDate);

    const now=new Date();

    expiry.setHours(0,0,0,0);
    now.setHours(0,0,0,0);

    return expiry<now;

  });

  if(expiring.length>0){

    new Notification("🥗 FreshGuard",{

      body:`${expiring.length} food item(s) are expiring soon.`,

      icon:"https://cdn-icons-png.flaticon.com/512/1046/1046784.png"

    });

    localStorage.setItem("lastNotification",today);

  }

  else if(expired.length>0){

    new Notification("⚠ FreshGuard",{

      body:`${expired.length} food item(s) have expired.`,

      icon:"https://cdn-icons-png.flaticon.com/512/1046/1046784.png"

    });

    localStorage.setItem("lastNotification",today);

  }

},[foods]);
  const editFood = (food) => {
    console.log(food);
  setEditId(food._id);

  setName(food.name);
  setQuantity(food.quantity);
  setCategory(food.category);

  setExpiryDate(
    new Date(food.expiryDate).toISOString().split("T")[0]
  );

  setIsEditing(true);
};
const getExpiryStatus = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);

  // Remove time part
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Expired";
  } else if (diffDays <= 7) {
    return "Expiring Soon";
  } else {
    return "Fresh";
  }
};
const filteredFoods = foods.filter((food) =>
  food.name.toLowerCase().includes(search.toLowerCase()) ||
  food.category.toLowerCase().includes(search.toLowerCase())
);
const totalItems = foods.length;

const expiredItems = foods.filter(
  (food) => getExpiryStatus(food.expiryDate) === "Expired"
).length;

const expiringSoon = foods.filter(
  (food) => getExpiryStatus(food.expiryDate) === "Expiring Soon"
).length;

const totalCategories = new Set(
  filteredFoods.map((food) => food.category)
).size;
const wastePercentage =
  totalItems === 0
    ? 0
    : Math.round((expiredItems / totalItems) * 100);

const savedPercentage =
  totalItems === 0
    ? 0
    : 100 - wastePercentage;
  const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
const getDaysLeft = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diff = expiry - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return `❌ Expired ${Math.abs(days)} day(s) ago`;
  }

  if (days === 0) {
    return "⚠ Expires Today";
  }

  if (days === 1) {
    return "⚠ Expires Tomorrow";
  }

  return `⏳ ${days} Days Left`;
};
const addShoppingItem = () => {
  if (shoppingItem.trim() === "") return;

  setShoppingList([...shoppingList, shoppingItem]);
  setShoppingItem("");
};

const deleteShoppingItem = (index) => {
  setShoppingList(
    shoppingList.filter((_, i) => i !== index)
  );
};
  return (
    <div className={darkMode ? "dashboard dark" : "dashboard"}>

      
      <div className="header">

  <div>
    <h1>🥗 FreshGuard</h1>
    <p>AI-Powered Food Inventory Management System</p>
  </div>

  <div className="header-actions">

    <button
      className="theme-btn"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
    </button>

  </div>

</div>
<div className="welcome-card">
  <h2>👋 Welcome, {localStorage.getItem("name")}</h2>

  <p>
    Manage your food inventory efficiently, reduce food waste,
    and discover delicious recipes with AI.
  </p>
</div>
<div className="summary-grid">

  <div className="summary-card blue">
    <h2 className="text-xl">Total Items</h2>
    <p className="text-3xl font-bold">{totalItems}</p>
  </div>

  <div className="summary-card yellow">
    <h2 className="text-xl">Expiring Soon</h2>
    <p className="text-3xl font-bold">{expiringSoon}</p>
  </div>

    <div className="summary-card red">
    <h2 className="text-xl">Expired</h2>
    <p className="text-3xl font-bold">{expiredItems}</p>
  </div>

  <div className="summary-card green">
    <h2 className="text-xl">Categories</h2>
    <p className="text-3xl font-bold">{totalCategories}</p>
  </div>
</div>

<div className="analytics-card">

  <h2>📈 Food Waste Analytics</h2>

  <div className="analytics-grid">

    <div className="analytics-box good">

      <h3>Food Saved</h3>

      <h1>{savedPercentage}%</h1>

    </div>

    <div className="analytics-box bad">

      <h3>Food Wasted</h3>

      <h1>{wastePercentage}%</h1>

    </div>

  </div>
  </div>
      <div className="food-form">
         <h2>Add Food</h2>

      <input
        type="text"
        placeholder="Food Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
  type="number"
  min="1"
  step="1"
  placeholder="Quantity"
  value={quantity}
  onChange={(e) => {
    const value = e.target.value;

    if (value === "" || Number(value) >= 1) {
      setQuantity(value);
    }
  }}
/>

      <br /><br />

      <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="">📂 Select Category</option>
  <option value="Fruits">🍎 Fruits</option>
  <option value="Vegetables">🥦 Vegetables</option>
  <option value="Dairy">🥛 Dairy</option>
  <option value="Bakery">🍞 Bakery</option>
  <option value="Meat">🍗 Meat</option>
  <option value="Frozen">🧊 Frozen</option>
  <option value="Beverages">🥤 Beverages</option>
  <option value="Snacks">🍪 Snacks</option>
  <option value="Others">📦 Others</option>
</select>

      <br /><br />

      <input
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />
      <br /><br />
      <br /><br />

     {isEditing ? (
  <button onClick={updateFood}>
    Update Food
  </button>
) : (
  <button onClick={addFood}>
    Add Food
  </button>
)}
</div>

      <hr />
      <input
  className="search-box"
  type="text"
  placeholder="🔍 Search by food or category..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "20px",
  }}
/>
<select
  className="sort-box"
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
>
  <option value="nearest">Nearest Expiry</option>
  <option value="latest">Latest Expiry</option>
</select>
<br />
<br />
      <h2>Food Items</h2>
<div className="food-grid">
  {filteredFoods.length === 0 ? (
    <div className="empty-card">
      <h2>🥫 Pantry Empty</h2>
      <p>No food items found.</p>
    </div>
  ) : (
    filteredFoods
      .sort((a, b) => {
        if (sortOrder === "nearest") {
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        } else {
          return new Date(b.expiryDate) - new Date(a.expiryDate);
        }
      })
      .map((food) => (
        <div key={food._id} className="food-card">

          <h3>{food.name}</h3>

          <p>
            <strong>Quantity:</strong> {food.quantity}
          </p>

          <p>
            <strong>Category:</strong> {food.category}
          </p>

          <p>
  <strong>Expiry:</strong>{" "}
  {new Date(food.expiryDate).toLocaleDateString()}
</p>

<p
  className={`countdown ${
    getExpiryStatus(food.expiryDate)
      .replace(" ", "-")
      .toLowerCase()
  }`}
>
  {getDaysLeft(food.expiryDate)}
</p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`status ${getExpiryStatus(food.expiryDate)
                .replace(" ", "-")
                .toLowerCase()}`}
            >
              {getExpiryStatus(food.expiryDate)}
            </span>
          </p>

          <button
  className="edit-btn"
  onClick={() => {
    console.log("Edit clicked", food);
    editFood(food);
  }}
>
  Edit
</button>

          <button
            className="delete-btn"
            onClick={() => deleteFood(food._id)}
          >
            Delete
          </button>
        </div>
      ))
  )}
</div>
      <button className="recipe-btn" onClick={handleRecipe}>
  {loadingRecipe ? "Generating Recipe..." : "🤖 Ask AI for Recipe"}
</button>

{recipe && (
  <div className="ai-chat">
    <div className="ai-header">
      🤖 FreshGuard AI Assistant
    </div>

    <div className="ai-message">
      <div className="recipe-content">{recipe}</div>
    </div>
  </div>
)}

{/* 🛒 Shopping List Starts Here */}

<div className="shopping-card">

  <h2>🛒 Shopping List</h2>

  <div className="shopping-input">

    <input
      type="text"
      placeholder="Add shopping item..."
      value={shoppingItem}
      onChange={(e)=>setShoppingItem(e.target.value)}
    />

    <button onClick={addShoppingItem}>
      Add
    </button>

  </div>

  {shoppingList.length===0 ? (

      <p>No shopping items.</p>

  ) : (

      shoppingList.map((item,index)=>(
        <div
          className="shopping-item"
          key={index}
        >
          <span>🛒 {item}</span>

          <button
            onClick={()=>deleteShoppingItem(index)}
          >
            ❌
          </button>
        </div>
      ))

  )}

</div>

{/* 🛒 Shopping List Ends Here */}
<div
  style={{
    marginTop: "50px",
    textAlign: "center",
  }}
>
  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    🚪 Logout
  </button>
</div>
    <footer className="footer">
  <p>© 2026 FreshGaurd | Built with ❤️ using MERN Stack</p>
</footer>

    </div>
  );
}

export default Dashboard;