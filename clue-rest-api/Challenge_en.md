# 🛠 CLUe API Technical Support Assessment

Welcome to the Technical Support integration test. This assessment evaluates your ability to understand API documentation, configure environment workflows in Postman, and document technical processes for end-users.

## 🎯 Objectives
1. **API Understanding:** Demonstrate your ability to navigate the CLUe API documentation and execute functional requests.
2. **Postman Mastery:** Use Environments, Variables, and Collections effectively.
3. **Documentation:** Provide clear, "support-ready" instructions within your Postman collection.

---

## 📖 The Task
You are required to build a **Postman Collection** that performs a specific user-management workflow using the CLUe API. Since you do not have a physical device, focus on the **Server/Cloud** logic.

### Documentation Reference
[CLUe API Guide](https://twilight-value-ef0.notion.site/CLUe-API-Guide-11f03724c781804a9682c27c9fe331d9)

### 🔑 Authentication Notice
To perform this test, you require an **API Key** and **Place id**. 
* Please reach out to your contact person to request your temporary credentials before starting.
* Once received, you must implement this key using Postman variables for security.

### The Scenario
A customer needs to automate user management. You must create a collection that performs the following **4 steps**:

1.  **System Check:** Retrieve a list of all "Doors" or "Places" to verify connection.
2.  **User Creation:** Create a new user with a unique ID and Name.
3.  **Status Update:** Update that specific user's status to `INACTIVE`.
4.  **User Deletion:** Delete the created user.
5.  **Log Retrieval:** Query the system logs to find events related to a specific timeframe.(Use bellow endpoint for retriving log)
```code=api
https://api.moon.supremainc.com/v1/audit-logs?size={{size}}&placeId={{placeId}}&startAt={{Time in utc epoch milliseconds }}&endAt={{Time in utc epoch milliseconds}}
````

---

## 🛠 Technical Requirements

### 1. Postman Environment
Do **not** hardcode values (like IDs or Keys) into the URLs or Bodies. You must use a Postman Environment file containing:
* `baseUrl`
* `apiKey`
* `placeId`
* `authId` (This should be captured from the response of your "Create User" request).

### 2. Documentation
Inside the Postman Collection:
* Every request must have a **Description** explaining what the request does.
* Use Markdown in the descriptions to highlight "Pro-Tips" for a customer.

### 3. Verification (Tests)
Each request must include at least one basic test in the **Tests** tab to verify success (e.g., checking for a `200 OK` or `201 Created` status code).

---

## 📤 Submission Instructions
Please provide a compressed (`.zip`) folder containing:
1.  The **Exported Postman Collection** (v2.1).
2.  The **Exported Postman Environment** (with dummy values or your trial values).
3.  A brief instruction note on how to import and run your collection.

**Evaluation Criteria:**
* **Accuracy:** Do the requests follow the documentation?
* **Organization:** Is the collection easy to read and use?
* **Variables:** Did you correctly use `{{variable_name}}` syntax?