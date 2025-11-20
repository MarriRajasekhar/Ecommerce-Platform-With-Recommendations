from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from mlxtend.frequent_patterns import apriori, association_rules
from faker import Faker
import random

app = FastAPI()

faker = Faker()


categories = ["Electronics", "Shoes", "Clothing", "Accessories", "Gaming", "Home Appliances"]

products = [
    {"id": i, "name": faker.word().capitalize(), "category": random.choice(categories),
     "price": random.randint(50, 2000), "stock": random.randint(5, 100), "sales": random.randint(10, 500)}
    for i in range(1, 51)
]

df_products = pd.DataFrame(products)

users = [{"user_id": i, "name": faker.name()} for i in range(1, 101)]
df_users = pd.DataFrame(users)

purchase_history = pd.DataFrame([
    {"user_id": random.choice(df_users["user_id"]), "product_id": random.choice(df_products["id"])}
    for _ in range(5000)  
])


scaler = StandardScaler()
X = df_products[['price', 'sales']].values
X_scaled = scaler.fit_transform(X)

kmeans = KMeans(n_clusters=4, random_state=42)
df_products['price_category'] = kmeans.fit_predict(X_scaled)

@app.get("/dynamic-pricing")
def get_dynamic_prices():
    for i, row in df_products.iterrows():
        if row['price_category'] == 3:  
            df_products.at[i, 'price'] *= 1.20  
        elif row['price_category'] == 2:  
            df_products.at[i, 'price'] *= 0.85  
        elif row['price_category'] == 1:  
            df_products.at[i, 'price'] *= 1.05  

    return df_products.to_dict(orient="records")


@app.get("/recommend/{product_id}")
def recommend_products(product_id: int):
    purchased_together = purchase_history[purchase_history["product_id"] == product_id]["user_id"].unique()
    recommended_items = purchase_history[purchase_history["user_id"].isin(purchased_together)]["product_id"].unique()
    
    recommended_products = df_products[df_products["id"].isin(recommended_items)]
    
    return recommended_products.sample(n=min(3, len(recommended_products))).to_dict(orient="records")

# ========================== 📊 MARKET BASKET ANALYSIS (ASSOCIATION RULES) ==========================
basket = purchase_history.pivot_table(index="user_id", columns="product_id", aggfunc=lambda x: 1, fill_value=0)

frequent_itemsets = apriori(basket, min_support=0.05, use_colnames=True)
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.2)

@app.get("/market-basket-analysis")
def get_association_rules():
    return rules.to_dict(orient="records")

# ========================== 🔮 USER PURCHASE PREDICTION MODEL ==========================
@app.get("/predict-next-purchase/{user_id}")
def predict_next_purchase(user_id: int):
    user_purchases = purchase_history[purchase_history["user_id"] == user_id]["product_id"].values
    if len(user_purchases) == 0:
        return {"message": "User has no purchase history"}
    
    most_frequent_category = df_products[df_products["id"].isin(user_purchases)]["category"].mode()[0]
    recommended_products = df_products[df_products["category"] == most_frequent_category]
    
    return recommended_products.sample(n=min(3, len(recommended_products))).to_dict(orient="records")

# ========================== 🚀 RUN THE ML SERVER ==========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
