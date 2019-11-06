# Transakcijų įgyvendinimas panaudojant REDIS duomenų bazę
---

# Esybės
---
## user(hash)
* **user:user_id** 
  * `name(String)`, 
  * `surname(String)`, 
  * `email(String)`, 
  * `phone(String)` 

---
## account(hash)
* **account:account_id** 
  * `account_balance(Number)`, 
  * `card_number(Number)`, 
  * `expiry_date(String)`
  
---
## transaction(hash)
* **transaction:transaction_id** 
  * `sender_id(String)`, 
  * `receiver_id(String)`, 
  * `ammount(Number)`

---
## user_account(string)
* **user_account:user_id**
  * `account_id(String)`

