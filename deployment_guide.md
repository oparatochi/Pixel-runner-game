# Platformer Game Deployment Guide

## Overview
This document provides instructions for deploying the "Pixel Runner" platformer game to the Google Play Store. The game has been developed using Phaser.js and can be packaged for Android using Cordova or Capacitor.

## Prerequisites
- Google Play Developer account ($25 one-time registration fee)
- Android SDK installed
- Cordova or Capacitor CLI installed
- Java Development Kit (JDK) installed
- Keystore file for app signing

## Step 1: Prepare App Assets

### App Icons
Create the following icon sizes for your app:
- 48x48 px (mdpi)
- 72x72 px (hdpi)
- 96x96 px (xhdpi)
- 144x144 px (xxhdpi)
- 192x192 px (xxxhdpi)
- 512x512 px (Play Store listing)

### Screenshots
Take screenshots of your game in action:
- At least 2 screenshots are required
- Recommended: 3-5 screenshots showing different aspects of gameplay
- Screenshot sizes: 16:9 aspect ratio (e.g., 1920x1080)

### Feature Graphic
Create a feature graphic for the Play Store listing:
- Size: 1024x500 px
- Should prominently display your game title and visual style

## Step 2: Package the Game for Android

### Using Cordova
```bash
# Install Cordova if not already installed
npm install -g cordova

# Create a new Cordova project
cordova create pixel-runner com.yourdomain.pixelrunner "Pixel Runner"
cd pixel-runner

# Add Android platform
cordova platform add android

# Copy your game files to www folder
# (Replace the contents of the www folder with your game files)

# Update config.xml with your app details
# Edit the config.xml file to include app name, description, and AdMob plugin

# Add AdMob plugin
cordova plugin add cordova-plugin-admob-free --variable ADMOB_APP_ID="ca-app-pub-9337140193574058~2326216750"

# Build the Android package
cordova build android --release
```

### Using Capacitor
```bash
# Install Capacitor if not already installed
npm install -g @capacitor/cli

# Initialize Capacitor in your project
npm install @capacitor/core @capacitor/android
npx cap init Pixel Runner com.yourdomain.pixelrunner

# Add Android platform
npx cap add android

# Copy your game files to the web directory
# (Ensure your game files are in the correct directory)

# Sync your web code to the native project
npx cap sync

# Open the Android project in Android Studio
npx cap open android
```

## Step 3: Sign Your App

### Generate a Keystore (if you don't have one)
```bash
keytool -genkey -v -keystore pixel-runner.keystore -alias pixel-runner -keyalg RSA -keysize 2048 -validity 10000
```

### Sign the APK
```bash
# For Cordova
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore pixel-runner.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk pixel-runner

# Optimize the APK
zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk pixel-runner.apk
```

For Capacitor, signing is typically done through Android Studio's build process.

## Step 4: Prepare Google Play Store Listing

### Required Information
- App title: "Pixel Runner"
- Short description (80 characters max)
- Full description (4000 characters max)
- App category: Games > Arcade
- Content rating: Complete the rating questionnaire
- Contact information: Email address and website
- Privacy policy URL: Must provide a valid privacy policy

### AdMob Integration
Ensure your app complies with Google's ads policies:
- Include proper disclosure about ads in your app description
- Ensure ads don't interfere with gameplay in a disruptive manner
- Configure your AdMob account to comply with privacy regulations

## Step 5: Upload to Google Play Console

1. Log in to your Google Play Console
2. Click "Create app"
3. Fill in the app details form
4. Upload your signed APK or Android App Bundle
5. Complete the store listing with all assets and descriptions
6. Set up pricing and distribution (free with ads)
7. Complete the content rating questionnaire
8. Review and submit for approval

## AdMob Configuration

### In Your Game Code
The AdMob integration is already set up in the game code with:
- Publisher ID: ca-app-pub-9337140193574058~2326216750
- Ad Unit ID: ca-app-pub-9337140193574058/1621952240

### In AdMob Console
1. Log in to your AdMob account
2. Ensure your app is properly registered
3. Link your AdMob account to your Google Play account
4. Monitor ad performance after launch

## Post-Launch Considerations

### Analytics
Consider implementing analytics to track:
- User retention
- Session length
- Level completion rates
- Ad interaction rates

### Updates
Plan for regular updates to:
- Add new levels
- Fix bugs
- Improve performance
- Add new features based on user feedback

## Support
For any issues with deployment or AdMob integration, refer to:
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [AdMob Help Center](https://support.google.com/admob)
- [Cordova Documentation](https://cordova.apache.org/docs/en/latest/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
