import { View, Text } from "react-native";
import React from "react";
import { Skeleton } from "@rneui/themed";

const Skeletons = () => {
  return (
    <View style={{height: 1000, width: "100%", display: 'flex', flexDirection: "row", flexWrap: "wrap", gap: 20, justifyContent:"center"}}>
      <Skeleton
        animation="wave"
        skeletonStyle={{ backgroundColor: "#3a3a3a" }}
        style={{ backgroundColor: "#282828", borderRadius: 10, width:"45%" }}
        height={180}

      />
      <Skeleton
        animation="wave"
        skeletonStyle={{ backgroundColor: "#3a3a3a" }}
        style={{ backgroundColor: "#282828", borderRadius: 10, width:"45%"}}
        height={180}
      />
      <Skeleton
        animation="wave"
        skeletonStyle={{ backgroundColor: "#3a3a3a" }}
        style={{ backgroundColor: "#282828", borderRadius: 10, width:"45%"}}
        height={180}
      />
      <Skeleton
        animation="wave"
        skeletonStyle={{ backgroundColor: "#3a3a3a" }}
        style={{ backgroundColor: "#282828", borderRadius: 10, width:"45%"}}
        height={180}
      />
    </View>
  );
};

export default Skeletons;
