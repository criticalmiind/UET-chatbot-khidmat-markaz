 # UET-chatbot-khidmat-markaz

## React Native Development Env Requirements:
1. VS code
2. Android Studio
3. Android SDK
4. Install JDK
    ```openjdk version "11" 2018-09-25
    OpenJDK Runtime Environment 18.9 (build 11+28)
    OpenJDK 64-Bit Server VM 18.9 (build 11+28, mixed mode)```
5. Node JS ```(v14.17.1)```
6. NPM ```(6.14.13)```
7. React native cli ```(7.0.4)```

<i>For Requirements Installation Please Follow This <a href="https://www.stackoverlode.com/blogs/single/how-to-install-and-setup-react-native-on-ubuntu-20-04-2-0-lts.asp" target="_blank">Article</a>.</i>


## Project Setup:
1. Clone Project From Github: ```https://github.com/criticalmiind/UET-chatbot-khidmat-markaz.git```
2. cd project directory ``` cd  UET-chatbot-khidmat-markaz ```
3. execute commands one by one to install dependancies:
    ```bash
    npm install # install packages
    react-native link # link libraries

    # For IOS dependancies
    cd ios && pod install && cd ../ # goto ios folder and install pod packages if you want to run ios
    ```

## Run Project:
1. Follow instraction to run project:
    ```bash
    npm run start # run packager in terminal and then open new terminal
    # To Run Project on Android:
    # Open android Studio and run emulator and then execute:
    npm run android # run project on android device or simulator
    
    
    # To Run Project on IOS:
    npm run ios # run project on ios device or simulator
    ```

## Build Apk/bundle file:
1. goto android folder ```cd android```
2. execute build command for apk/abb file:
    ```bash
    ./gradlew assembleRelease # for for building apk file
    # apk file path will be: EKhidmatMarkaz/android/app/build/outputs/apk/release/app-release.apk

    # or
    ./gradlew bundleRelease # for for building abb file
    ```

## Android Issues:
1. Issue: Configuration with name 'compile' not found.
```java
// Answer: https://github.com/software-mansion/react-native-reanimated/issues/3242#issuecomment-1145423942

// Add a section to the file <project_folder>/android/build.gradle
subprojects { subproject ->
        if(project['name'] == 'react-native-reanimated'){
            project.configurations { compile { } }
        }
}
```


## Author

* **GitHub** - [Shawal Ahmad Mohmand](https://github.com/criticalmiind)
* **YouTube** - [Shawal Ahmad Mohmand Official](https://www.youtube.com/c/ShawalAhmadMohmandOfficail)
* **LinkedIn** - [Shawal Ahmad Mohmand](https://www.linkedin.com/in/shawalahmad/)
* **Facebook Page** - [Shawal Ahmad Mohmand Official](https://web.facebook.com/ShawalAhmadOfficialPage)





# Junks

<!-- adb shell input keyevent 82 -->