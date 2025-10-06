import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import ImageUpload from "../components/ImageUpload";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Download, Save, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";

const dietaryOptions = ["Vegetarian", "Vegan", "Keto", "Paleo", "Balanced"];

const dishes = {
  Vegetarian: [
    // Breakfast
    "Overnight Oats with Berries",
    "Greek Yogurt Parfait",
    "Spinach and Mushroom Omelette",
    "Whole Grain Pancakes with Fruit",
    "Vegetable Upma",
    "Chickpea Flour Pancakes",
    "Cottage Cheese Toast",
    "Banana Oatmeal Smoothie Bowl",
    "Masala Dosa with Coconut Chutney",
    "Breakfast Burrito with Scrambled Eggs",
    "Ricotta and Honey Toast",
    "Apple Cinnamon Waffles",
    "Peanut Butter and Banana Smoothie",
    "Mixed Berry Chia Pudding",
    "English Muffin with Avocado",
    "Multigrain Porridge with Nuts",
    // Lunch
    "Quinoa Buddha Bowl",
    "Mediterranean Pasta Salad",
    "Grilled Vegetable Wrap",
    "Lentil and Spinach Curry",
    "Caprese Sandwich",
    "Vegetable Stir-Fry with Tofu",
    "Black Bean Burrito Bowl",
    "Roasted Vegetable Quiche",
    // Dinner
    "Eggplant Parmesan",
    "Mushroom Risotto",
    "Vegetable Lasagna",
    "Stuffed Bell Peppers",
    "Cauliflower Mac and Cheese",
    "Portobello Mushroom Burger",
    "Vegetable Biryani",
    "Spinach and Ricotta Cannelloni",
    // Snacks
    "Trail Mix with Nuts and Dried Fruit",
    "Hummus with Carrot Sticks",
    "Greek Yogurt with Honey",
    "Apple Slices with Peanut Butter",
    "Cheese and Crackers",
    "Roasted Chickpeas",
    "Fruit and Nut Energy Balls",
    "Vegetable Spring Rolls"
  ],
  Vegan: [
    // Breakfast
    "Chia Seed Pudding",
    "Tofu Scramble",
    "Avocado Toast with Seeds",
    "Almond Milk Smoothie Bowl",
    "Vegan Banana Pancakes",
    "Quinoa Porridge with Berries",
    "Coconut Yogurt Parfait",
    "Overnight Oats with Plant Milk",
    // Lunch
    "Buddha Bowl with Tahini Dressing",
    "Chickpea Salad Sandwich",
    "Lentil and Vegetable Soup",
    "Quinoa Stuffed Sweet Potato",
    "Tempeh BLT Sandwich",
    "Black Bean and Corn Tacos",
    "Mediterranean Couscous Bowl",
    "Vegan Pesto Pasta",
    // Dinner
    "Mushroom and Walnut 'Meatballs'",
    "Cauliflower and Chickpea Curry",
    "Vegan Shepherd's Pie",
    "Stir-Fried Tofu with Vegetables",
    "Black Bean Burgers",
    "Lentil Bolognese",
    "Roasted Vegetable Pizza",
    "Jackfruit Pulled 'Pork'",
    // Snacks
    "Mixed Berry Smoothie",
    "Guacamole with Tortilla Chips",
    "Roasted Nuts and Seeds",
    "Fruit Leather",
    "Vegetable Sushi Rolls",
    "Kale Chips",
    "Energy Balls",
    "Dried Fruit Mix"
  ],
  Keto: [
    // Breakfast
    "Bacon and Eggs",
    "Keto Coffee with MCT Oil",
    "Cream Cheese Pancakes",
    "Avocado and Egg Bowl",
    "Sausage and Cheese Frittata",
    "Coconut Flour Waffles",
    "Ham and Cheese Omelette",
    "Keto Breakfast Sandwich",
    // Lunch
    "Tuna Salad Lettuce Wraps",
    "Caesar Salad with Chicken",
    "Keto Club Sandwich",
    "Zucchini Noodles with Meatballs",
    "Buffalo Chicken Wings",
    "Salmon Avocado Bowl",
    "Egg Salad in Bell Peppers",
    "Greek Salad with Feta",
    // Dinner
    "Butter Chicken",
    "Grilled Ribeye Steak",
    "Baked Salmon with Herbs",
    "Chicken Alfredo with Zoodles",
    "Beef and Broccoli Stir-Fry",
    "Pork Chops with Vegetables",
    "Cauliflower Mac and Cheese",
    "Keto Pizza with Meat Toppings",
    // Snacks
    "String Cheese",
    "Hard-Boiled Eggs",
    "Pepperoni Slices",
    "Almonds and Cheese Cubes",
    "Pork Rinds",
    "Fat Bombs",
    "Beef Jerky",
    "Cucumber with Ranch Dip"
  ],
  Paleo: [
    // Breakfast
    "Sweet Potato Hash with Eggs",
    "Grain-Free Granola",
    "Turkey and Avocado Bowl",
    "Banana Almond Pancakes",
    "Paleo Breakfast Muffins",
    "Smoked Salmon with Vegetables",
    "Fruit and Nut Bowl",
    "Paleo Breakfast Burrito Bowl",
    // Lunch
    "Chicken and Avocado Lettuce Wraps",
    "Tuna Nicoise Salad",
    "Turkey and Sweet Potato Chili",
    "Grilled Chicken Caesar Salad",
    "Zucchini Noodle Stir-Fry",
    "Coconut Shrimp",
    "Beef and Vegetable Skewers",
    "Mediterranean Fish",
    // Dinner
    "Grass-Fed Beef Burger",
    "Roasted Chicken with Herbs",
    "Grilled Salmon with Asparagus",
    "Bison Meatballs",
    "Lamb Chops with Mint",
    "Turkey Stuffed Peppers",
    "Paleo Beef Stew",
    "Coconut Curry Chicken",
    // Snacks
    "Mixed Nuts",
    "Apple with Almond Butter",
    "Beef or Turkey Jerky",
    "Dried Fruit and Nuts",
    "Paleo Energy Balls",
    "Sweet Potato Chips",
    "Fresh Fruit Medley",
    "Raw Vegetable Platter"
  ],
  Balanced: [
    // Breakfast
    "Whole Grain Toast with Eggs",
    "Steel Cut Oats with Fruit",
    "Protein Smoothie Bowl",
    "Whole Wheat Bagel with Cream Cheese",
    "Breakfast Burrito",
    "Yogurt and Granola Parfait",
    "Breakfast Quinoa Bowl",
    "Fruit and Nut Oatmeal",
    // Lunch
    "Turkey and Avocado Sandwich",
    "Mixed Green Salad with Grilled Chicken",
    "Quinoa Bowl with Roasted Vegetables",
    "Tuna Wrap with Whole Grain Tortilla",
    "Brown Rice Bowl with Tofu",
    "Mediterranean Chicken Pita",
    "Veggie and Hummus Sandwich",
    "Lentil and Rice Bowl",
    // Dinner
    "Grilled Fish with Brown Rice",
    "Lean Beef Stir-Fry",
    "Chicken Breast with Sweet Potato",
    "Turkey Meatballs with Pasta",
    "Baked Salmon with Quinoa",
    "Shrimp and Vegetable Skewers",
    "Lean Pork Tenderloin",
    "White Fish with Couscous",
    // Snacks
    "Greek Yogurt with Berries",
    "Whole Grain Crackers with Cheese",
    "Mixed Nuts and Dried Fruit",
    "Apple with Peanut Butter",
    "Hummus with Pita Chips",
    "Protein Bar",
    "Fruit Smoothie",
    "Popcorn with Nuts"
  ]
};

export default function MealPlanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [mealImages, setMealImages] = useState({ breakfast: null, lunch: null, dinner: null, snacks: null });
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [activePlanId, setActivePlanId] = useState(
  localStorage.getItem('activePlanId') || null
);

  // ...existing code...
  const handleOpenImageUpload = (mealType) => {
    setSelectedMealType(mealType);
    setIsImageUploadOpen(true);
  };

  const handleImageSelect = (imageData) => {
    if (selectedMealType) {
      setMealImages((prev) => ({
        ...prev,
        [selectedMealType]: imageData,
      }));
      setIsImageUploadOpen(false);
    }
  };
  const [diet, setDiet] = useState("");
  const [mealPlan, setMealPlan] = useState({ breakfast: "", lunch: "", dinner: "", snacks: "" });
  const [savedPlans, setSavedPlans] = useState(
    JSON.parse(localStorage.getItem('savedMealPlans') || '[]')
  );
  const [showPastPlans, setShowPastPlans] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [customDishes, setCustomDishes] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: ""
  });
  const [suggestions, setSuggestions] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });
  const [savedCustomDishes, setSavedCustomDishes] = useState(
    JSON.parse(localStorage.getItem('customDishes') || '[]')
  );

  const getSuggestions = (input, mealType) => {
    if (!input) return [];
    input = input.toLowerCase();
    const allDishes = [...Object.values(dishes).flat(), ...savedCustomDishes];
    
    // Create a scoring system for better matching
    const scoredMatches = allDishes
      .map(dish => {
        const lowerDish = dish.toLowerCase();
        let score = 0;
        
        // Exact match at start gets highest priority
        if (lowerDish.startsWith(input)) score += 100;
        // Word boundary match gets second priority
        else if (lowerDish.includes(' ' + input)) score += 50;
        // Contains the input anywhere gets lowest priority
        else if (lowerDish.includes(input)) score += 25;
        
        // Bonus points for matching meal type (breakfast, lunch, dinner, snacks)
        if (lowerDish.includes(mealType.toLowerCase())) score += 10;
        
        return { dish, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);
    
    // Return top 8 suggestions
    return scoredMatches.slice(0, 8).map(({ dish }) => dish);
  };

  const handleCustomDishChange = (mealType, value) => {
    setCustomDishes(prev => ({
      ...prev,
      [mealType]: value
    }));
    setSuggestions(prev => ({
      ...prev,
      [mealType]: getSuggestions(value, mealType)
    }));
  };

  const handleSelectSuggestion = (mealType, dish) => {
    setCustomDishes(prev => ({
      ...prev,
      [mealType]: dish
    }));
    setSuggestions(prev => ({
      ...prev,
      [mealType]: []
    }));
    setMealPlan(prev => ({
      ...prev,
      [mealType]: dish
    }));
  };

  const saveCustomDish = (dish) => {
    if (!dish || savedCustomDishes.includes(dish)) return;
    const newSavedDishes = [...savedCustomDishes, dish];
    setSavedCustomDishes(newSavedDishes);
    localStorage.setItem('customDishes', JSON.stringify(newSavedDishes));
  };

  const generatePlan = () => {
    if (!diet) return;
    const selected = dishes[diet];
    const randomIndex = () => Math.floor(Math.random() * selected.length);
    setMealPlan({
      breakfast: customDishes.breakfast || selected[randomIndex()],
      lunch: customDishes.lunch || selected[randomIndex()],
      dinner: customDishes.dinner || selected[randomIndex()],
      snacks: customDishes.snacks || selected[randomIndex()],
    });
  };

  const replaceMeal = (mealType) => {
    const alternatives = dishes[diet];
    const random = alternatives[Math.floor(Math.random() * alternatives.length)];
    setMealPlan({ ...mealPlan, [mealType]: random });
  };

  const saveMealPlan = () => {
    const newPlan = {
      date: new Date().toISOString(),
      diet,
      plan: mealPlan,
      images: mealImages,
      id: Date.now()
    };
    const updatedPlans = [...savedPlans, newPlan];
    setSavedPlans(updatedPlans);
    localStorage.setItem('savedMealPlans', JSON.stringify(updatedPlans));
    alert('Meal plan saved successfully!');

      // Ask if user wants to set this plan as active
    if (window.confirm('Do you want to set this plan as your active plan?')) {
      setActivePlanId(newPlan.id);
      localStorage.setItem('activePlanId', newPlan.id);
    }
  };

  const deletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      const updatedPlans = savedPlans.filter(plan => plan.id !== planId);
      setSavedPlans(updatedPlans);
      localStorage.setItem('savedMealPlans', JSON.stringify(updatedPlans));

      if (activePlanId === planId) {
        setActivePlanId(null);
        localStorage.removeItem('activePlanId');
      }
    }
  };

  const clearAllPlans = () => {
    if (window.confirm('Are you sure you want to delete all saved meal plans? This action cannot be undone.')) {
      setSavedPlans([]);
      localStorage.setItem('savedMealPlans', '[]');
    }
  };

  const exportMealPlan = () => {
    const content = `
DineFit - Your Meal Plan
Generated on: ${new Date().toLocaleDateString()}
Diet Type: ${diet}

Breakfast: ${mealPlan.breakfast}
Lunch: ${mealPlan.lunch}
Dinner: ${mealPlan.dinner}
Snacks: ${mealPlan.snacks}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mealplan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🍽️ Your Personal Meal Planner
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] text-lg md:text-xl max-w-2xl mx-auto">
            Create your perfect meal plan based on your dietary preferences
          </p>
        </div>

        <div className="space-y-8">
{/* -------- Active Plan Display (Top) -------- */}
{activePlanId && (() => {
  const activePlan = savedPlans.find(p => p.id === Number(activePlanId));
  if (!activePlan) return null;

  return (
  <div className="mb-8 p-6 bg-[hsl(var(--card))]/70 border-4 border-[hsl(var(--primary))] rounded-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
          🌟 Active Meal Plan
        </h2>
  <span className="px-3 py-1 text-sm font-semibold text-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))] rounded-full">
          Active
        </span>
      </div>

  <p className="text-[hsl(var(--muted-foreground))] mb-6">Diet Type: {activePlan.diet}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(activePlan.plan).map(([mealType, dish]) => (
          <div key={mealType} className="bg-[hsl(var(--card))]/50 rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary))/0.08] flex items-center justify-center text-2xl mb-3">
              {mealType === 'breakfast' && '🌅'}
              {mealType === 'lunch' && '🌞'}
              {mealType === 'dinner' && '🌙'}
              {mealType === 'snacks' && '🍎'}
            </div>
            <h4 className="font-semibold capitalize text-[hsl(var(--primary))] mb-2">{mealType}</h4>
            <p className="text-[hsl(var(--card-foreground))] text-center mb-2">{dish}</p>
            {activePlan.images && activePlan.images[mealType] && (
              <img
                src={activePlan.images[mealType]}
                alt={dish || mealType}
                className="w-full h-32 object-cover rounded-lg shadow-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
})()}
        {/* -------- End Active Plan Display -------- */}
         {/* Collapsible Recent Plans */}
          <Collapsible 
            open={isOpen}
            onOpenChange={setIsOpen}
            className="backdrop-blur-sm bg-[hsl(var(--card))]/50 rounded-3xl p-8 shadow-xl border border-[hsl(var(--border))] transition-all duration-300 ease-in-out"
          >
            <div className="flex justify-between items-center mb-6">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex items-center gap-2 hover:bg-transparent p-0"
                >
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Recent Meal Plans {savedPlans.length > 0 && `(${savedPlans.length})`}
                  </h2>
                  <ChevronDown
                    className={`w-6 h-6 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="p-2 rounded-md border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] focus:border-transparent bg-[hsl(var(--input))] text-[hsl(var(--card-foreground))]"
                />
                {savedPlans.length > 0 && (
                  <Button
                    onClick={clearAllPlans}
                    variant="outline"
                    className="text-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive))/0.9] hover:bg-[hsl(var(--destructive))/0.08]"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            <CollapsibleContent className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              
              <div className="grid grid-cols-1 gap-6 mb-4">
                {savedPlans
                  .filter(plan => !searchDate || plan.date.includes(searchDate))
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, showPastPlans ? undefined : 3)
                  .map((plan, index) => (
                    <div
                      key={index}
                      className="bg-[hsl(var(--card))]/70 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-emerald-700">
                            {new Date(plan.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h3>
                          <p className="text-[hsl(var(--muted-foreground))]">Diet Type: {plan.diet}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDiet(plan.diet);
                              setMealPlan(plan.plan);
                              setMealImages(plan.images || { breakfast: null, lunch: null, dinner: null, snacks: null });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            Restore Plan
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePlan(plan.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(plan.plan).map(([mealType, dish]) => (
                          <div key={mealType} className="bg-[hsl(var(--card))]/50 rounded-lg p-4">
                            <h4 className="font-medium capitalize text-[hsl(var(--primary))] mb-2">{mealType}</h4>
                            <p className="text-[hsl(var(--card-foreground))]">{dish}</p>
                            {plan.images && plan.images[mealType] && (
                              <img
                                src={plan.images[mealType]}
                                alt={dish || mealType}
                                className="w-full h-32 object-cover rounded-lg mt-2 shadow"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                {savedPlans.length === 0 ? (
                  <div className="text-center text-[hsl(var(--muted-foreground))] py-8">
                    No saved meal plans yet. Start by generating your first plan!
                  </div>
                ) : savedPlans.length > 3 && (
                  <Button
                    onClick={() => setShowPastPlans(!showPastPlans)}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    {showPastPlans ? 'Show Less' : `Show ${savedPlans.length - 3} More Plans`}
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Generate New Plan Section */}
          <div className="backdrop-blur-sm bg-[hsl(var(--card))]/60 rounded-3xl p-8 shadow-xl border border-[hsl(var(--border))]">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
              Create New Meal Plan
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <Select onValueChange={(value) => setDiet(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Diet" />
                </SelectTrigger>
                <SelectContent>
                  {dietaryOptions.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={generatePlan}
                className="bg-[hsl(var(--primary))] hover:brightness-95 text-[hsl(var(--primary-foreground))] px-8"
              >
                Generate Plan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Object.entries(customDishes).map(([mealType, value]) => (
                <div key={mealType} className="relative">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold capitalize bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                      Custom {mealType}
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleCustomDishChange(mealType, e.target.value)}
                        placeholder={`Add your ${mealType} dish...`}
                        className="w-full p-2 rounded-md border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))/0.24] focus:border-transparent bg-[hsl(var(--input))] text-[hsl(var(--card-foreground))]"
                      />
                      {suggestions[mealType].length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-[hsl(var(--card))] rounded-md shadow-lg border border-[hsl(var(--border))] max-h-64 overflow-y-auto">
                          {suggestions[mealType].map((suggestion, index) => {
                            // Highlight the matched text
                            const lowerSuggestion = suggestion.toLowerCase();
                            const lowerInput = customDishes[mealType].toLowerCase();
                            const startIndex = lowerSuggestion.indexOf(lowerInput);
                            
                            let parts = [];
                            if (startIndex >= 0) {
                              parts = [
                                suggestion.slice(0, startIndex),
                                suggestion.slice(startIndex, startIndex + lowerInput.length),
                                suggestion.slice(startIndex + lowerInput.length)
                              ];
                            }
                            
                            return (
                              <div
                                key={index}
                                onClick={() => handleSelectSuggestion(mealType, suggestion)}
                                className="px-4 py-2 hover:bg-[hsl(var(--card))]/70 cursor-pointer text-[hsl(var(--muted-foreground))] flex items-center justify-between group"
                              >
                                <span>
                                  {startIndex >= 0 ? (
                                    <>
                                      {parts[0]}
                                      <span className="bg-emerald-100 font-medium">{parts[1]}</span>
                                      {parts[2]}
                                    </>
                                  ) : suggestion}
                                </span>
                                <span className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  Select
                                </span>
                              </div>
                            );
                          })}
                          {suggestions[mealType].length === 8 && (
                            <div className="px-4 py-2 text-sm text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))]/50 border-t border-[hsl(var(--border))]">
                              Type more to see more specific suggestions
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {customDishes[mealType] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => saveCustomDish(customDishes[mealType])}
                        className="mt-2 text-emerald-600 hover:text-emerald-700"
                      >
                        Save for Future
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {mealPlan.breakfast && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {Object.entries(mealPlan).map(([mealType, dish]) => (
                    <Card key={mealType} className="transform hover:-translate-y-1 transition-transform duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold capitalize bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {mealType}
                          </h2>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                            {mealType === 'breakfast' && '🌅'}
                            {mealType === 'lunch' && '🌞'}
                            {mealType === 'dinner' && '🌙'}
                            {mealType === 'snacks' && '🍎'}
                          </div>
                        </div>
                        <p className="text-[hsl(var(--card-foreground))] mb-4">{dish}</p>
                        {mealImages[mealType] && (
                          <img
                            src={mealImages[mealType]}
                            alt={dish || mealType}
                            className="w-full h-32 object-cover rounded-lg mb-2 shadow"
                          />
                        )}
                        <div className="flex flex-col gap-2 mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenImageUpload(mealType)}
                            className="w-full hover:bg-emerald-50"
                          >
                            Upload Image / Camera
                          </Button>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => replaceMeal(mealType)}
                          className="w-full hover:bg-emerald-50"
                        >
                          Replace
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={saveMealPlan}
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-emerald-50"
                  >
                    <Save className="w-4 h-4" />
                    Save Plan
                  </Button>
                  <Button
                    onClick={exportMealPlan}
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-emerald-50"
                  >
                    <Download className="w-4 h-4" />
                    Export Plan
                  </Button>
                </div>
              </>
            )}
            {isImageUploadOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-[hsl(var(--card))] rounded-xl p-6 max-w-md w-full border border-[hsl(var(--border))]">
                  <h3 className="text-lg font-semibold mb-4">
                    Add Image for {selectedMealType}
                  </h3>
                  <ImageUpload onImageSelect={handleImageSelect} />
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => setIsImageUploadOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}