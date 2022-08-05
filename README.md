# UET-chatbot-khidmat-markaz


## Android Issues:
1. change chunks size:
```java
// file path: EKhidmatMarkaz/node_modules/react-native-audio-record/android/src/main/java/com/goodatlas/audiorecord/RNAudioRecordModule.java


// byte[] buffer = new byte[bufferSize]; // comment this line
byte[] buffer = new byte[4096]; // add this line
```

2. Issue: Configuration with name 'compile' not found.
```java
// Answer: https://github.com/software-mansion/react-native-reanimated/issues/3242#issuecomment-1145423942

// Add a section to the file <project_folder>/android/build.gradle
subprojects { subproject ->
        if(project['name'] == 'react-native-reanimated'){
            project.configurations { compile { } }
        }
}
```