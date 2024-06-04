import { FlatList, StyleSheet, View, ViewToken } from "react-native";
import React, { memo, useCallback } from "react";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedView } from "@/src/components/ThemedView";
import { OnboardingData, data } from "@/src/components/on-board/data";
import { BoardCard } from "@/src/components/on-board/board-card";
import { Pagination } from "@/src/components/on-board/pagination";
import { BoardButton } from "@/src/components/on-board/board-button";

const OnBoardScreen = memo(() => {
  const flatlistRef = useAnimatedRef<FlatList<OnboardingData>>();
  const x = useSharedValue(0);
  const flatlistIndex = useSharedValue(0);
  const renderBoard = useCallback(
    ({ item, index }: { item: OnboardingData; index: number }) => {
      return <BoardCard item={item} index={index} x={x} />;
    },
    []
  );
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0].index !== null) {
        flatlistIndex.value = viewableItems[0].index;
      }
    },
    []
  );
  return (
    <ThemedView style={styles.container}>
      <Animated.FlatList
        ref={flatlistRef}
        data={data}
        onScroll={onScroll}
        renderItem={renderBoard}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        horizontal
        onViewableItemsChanged={onViewableItemsChanged}
        bounces={false}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 10,
        }}
      />
      <View style={styles.bottomContainer}>
        <Pagination data={data} x={x} />
        <BoardButton
          flatlistRef={flatlistRef}
          flatlistIndex={flatlistIndex}
          dataLength={data.length}
          x={x}
        />
      </View>
    </ThemedView>
  );
});

OnBoardScreen.displayName = "OnBoardScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 30,
    padding: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
