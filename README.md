# Weather-Web-and-Mobile-app
Weather App Project Documentation
===================================

Project Overview:
-----------------
This full-stack weather application includes three major components:
1. Django Backend: Provides a RESTful API that integrates with weather services.
2. React Web Frontend: A responsive web interface that consumes the Django API.
3. Expo Mobile App: A cross-platform mobile application built with Expo and React Native.

Project Structure:
------------------
Weather App/
    ├── Backend/           # Django backend project
    ├── Mobile/
    │   └── my-app/        # Expo mobile app (React Native)
    ├── Web/
    │   └── weatherapp/    # React web project
    └── venv/              # (Optional) Python virtual environment

Setup and Installation:
-------------------------

Prerequisites:
--------------
- Node.js (v14 or later) and npm
- Python (v3.8 or later) and pip
- Expo CLI (install globally using: npm install -g expo-cli)

Backend (Django):
-----------------
1. Open a terminal and navigate to the Backend folder:
   cd Backend
2. Create a Python virtual environment (if not already created):
   python -m venv venv
3. Activate the virtual environment:
   - Windows: venv\Scripts\activate
   - macOS/Linux: source venv/bin/activate
4. Install required dependencies:
   pip install -r requirements.txt
5. Apply database migrations:
   python manage.py migrate
6. Run the Django development server:
   python manage.py runserver

Web Frontend (React):
---------------------
1. Open a terminal and navigate to the React project directory:
   cd Web/weatherapp
2. Install npm dependencies:
   npm install
3. Start the React development server:
   npm start
   (The application will be available at http://localhost:3000)

Mobile App (Expo):
------------------
1. Open a terminal and navigate to the Expo project directory:
   cd Mobile/my-app
2. Install npm dependencies:
   npm install
3. Start the Expo development server:
   expo start
4. Follow the terminal instructions or open the Expo Developer Tools in your browser to run the app on an emulator or a physical device.

Running the Applications:
-------------------------
- Ensure the Django backend is running to serve API requests.
- The React web app and Expo mobile app both rely on the backend for data.
- Update any API endpoint configurations in the React and Expo projects if necessary.

Contributing:
-------------
1. Fork the repository.
2. Create a new feature branch:
   git checkout -b feature/YourFeature
3. Commit your changes:
   git commit -m "Describe your changes"
4. Push the branch:
   git push origin feature/YourFeature
5. Open a pull request for review.

License:
--------
This project is licensed under the MIT License. See the LICENSE file for details.

