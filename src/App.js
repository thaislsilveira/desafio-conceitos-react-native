import React, {useEffect, useState } from "react";

import {
  SafeAreaView,
  Alert,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  },[]);

  async function handleLikeRepository(id) {
    // Implement "Like Repository" functionality

    try {
      const liked = await api.post(`repositories/${id}/like`);

      const updatedList = repositories.map(repositor => 
        (repositor.id === liked.data.id)
          ? liked.data
          : repositor
      );

      setRepositories(updatedList);

    } catch (err) {
      Alert.alert('Ops', `${err.response.data.error}`);
    }
  }

  const techList = (techs) => {
    return techs.map(tech => {
      return (
        <Text key={tech} style={styles.tech}>
          {tech}
        </Text>
      )
    })
  }



  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <View style={styles.repositoryContainer}>
          <FlatList
            data={repositories}
            keyExtractor={repositor => repositor.id}
            renderItem={({ item: repositor }) => (
            <>
              <Text style={styles.repository}>{repositor.title}</Text>
              <View style={styles.techsContainer}>
               {techList(repositor.techs)}
              </View>

            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                testID={`repository-likes-${repositor.id}`}
              >
                {repositor.likes} curtidas
              </Text>
           </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLikeRepository(repositor.id)}
            // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
            testID={`like-button-${repositor.id}`}
          >
            <Text style={styles.buttonText}>Curtir</Text>
          </TouchableOpacity>
            </>
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
