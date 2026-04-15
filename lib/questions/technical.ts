import type { Question } from './behavioral'

export const technicalQuestions: Question[] = [
  // Arrays
  {
    id: 'tech-001', type: 'TECHNICAL', category: 'arrays', difficulty: 'EASY',
    question: 'Given an array of integers, find two numbers that add up to a target sum and return their indices. Assume exactly one solution exists.',
    requiresCode: true,
    starterCode: `function twoSum(nums: number[], target: number): number[] {\n  // Your solution here\n}`,
    googleFocus: true,
  },
  {
    id: 'tech-002', type: 'TECHNICAL', category: 'arrays', difficulty: 'MEDIUM',
    question: 'Given an integer array, return all triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.',
    requiresCode: true,
    starterCode: `function threeSum(nums: number[]): number[][] {\n  // Your solution here\n}`,
    googleFocus: true,
  },
  {
    id: 'tech-003', type: 'TECHNICAL', category: 'arrays', difficulty: 'MEDIUM',
    question: 'Given a list of daily stock prices, find the maximum profit you can achieve by buying on one day and selling on a later day.',
    requiresCode: true,
    starterCode: `function maxProfit(prices: number[]): number {\n  // Your solution here\n}`,
    googleFocus: false,
  },
  {
    id: 'tech-004', type: 'TECHNICAL', category: 'arrays', difficulty: 'HARD',
    question: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    requiresCode: true,
    starterCode: `function trap(height: number[]): number {\n  // Your solution here\n}`,
    googleFocus: true,
  },

  // Strings
  {
    id: 'tech-005', type: 'TECHNICAL', category: 'strings', difficulty: 'EASY',
    question: 'Write a function that checks if a given string is a palindrome, considering only alphanumeric characters and ignoring case.',
    requiresCode: true,
    starterCode: `function isPalindrome(s: string): boolean {\n  // Your solution here\n}`,
    googleFocus: false,
  },
  {
    id: 'tech-006', type: 'TECHNICAL', category: 'strings', difficulty: 'MEDIUM',
    question: 'Given a string s, find the length of the longest substring without repeating characters.',
    requiresCode: true,
    starterCode: `function lengthOfLongestSubstring(s: string): number {\n  // Your solution here\n}`,
    googleFocus: true,
  },
  {
    id: 'tech-007', type: 'TECHNICAL', category: 'strings', difficulty: 'HARD',
    question: 'Given strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included. If there is no such window, return "".',
    requiresCode: true,
    starterCode: `function minWindow(s: string, t: string): string {\n  // Your solution here\n}`,
    googleFocus: true,
  },

  // Trees
  {
    id: 'tech-008', type: 'TECHNICAL', category: 'trees', difficulty: 'EASY',
    question: 'Given the root of a binary tree, return the maximum depth (number of nodes along the longest path from root to leaf).',
    requiresCode: true,
    starterCode: `class TreeNode {\n  val: number\n  left: TreeNode | null\n  right: TreeNode | null\n  constructor(val = 0) { this.val = val; this.left = null; this.right = null; }\n}\n\nfunction maxDepth(root: TreeNode | null): number {\n  // Your solution here\n}`,
    googleFocus: false,
  },
  {
    id: 'tech-009', type: 'TECHNICAL', category: 'trees', difficulty: 'MEDIUM',
    question: 'Implement a function to check whether a binary tree is a valid Binary Search Tree.',
    requiresCode: true,
    starterCode: `class TreeNode {\n  val: number\n  left: TreeNode | null\n  right: TreeNode | null\n  constructor(val = 0) { this.val = val; this.left = null; this.right = null; }\n}\n\nfunction isValidBST(root: TreeNode | null): boolean {\n  // Your solution here\n}`,
    googleFocus: true,
  },
  {
    id: 'tech-010', type: 'TECHNICAL', category: 'trees', difficulty: 'HARD',
    question: 'Given a binary tree, find the length of the longest path between any two nodes. The path may or may not pass through the root.',
    requiresCode: true,
    starterCode: `class TreeNode {\n  val: number\n  left: TreeNode | null\n  right: TreeNode | null\n  constructor(val = 0) { this.val = val; this.left = null; this.right = null; }\n}\n\nfunction diameterOfBinaryTree(root: TreeNode | null): number {\n  // Your solution here\n}`,
    googleFocus: true,
  },

  // Graphs
  {
    id: 'tech-011', type: 'TECHNICAL', category: 'graphs', difficulty: 'MEDIUM',
    question: 'Given an m x n 2D binary grid where 1 represents land and 0 represents water, return the number of islands.',
    requiresCode: true,
    starterCode: `function numIslands(grid: string[][]): number {\n  // Your solution here\n}`,
    googleFocus: true,
  },
  {
    id: 'tech-012', type: 'TECHNICAL', category: 'graphs', difficulty: 'HARD',
    question: 'Given a list of words and two words beginWord and endWord, find the length of the shortest transformation sequence from beginWord to endWord, changing one letter at a time.',
    requiresCode: true,
    starterCode: `function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {\n  // Your solution here\n}`,
    googleFocus: true,
  },

  // Dynamic Programming
  {
    id: 'tech-013', type: 'TECHNICAL', category: 'dynamic-programming', difficulty: 'EASY',
    question: 'You are climbing a staircase that takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    requiresCode: true,
    starterCode: `function climbStairs(n: number): number {\n  // Your solution here\n}`,
    googleFocus: false,
  },
  {
    id: 'tech-014', type: 'TECHNICAL', category: 'dynamic-programming', difficulty: 'MEDIUM',
    question: 'Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.',
    requiresCode: true,
    starterCode: `function maxSubArray(nums: number[]): number {\n  // Your solution here\n}`,
    googleFocus: false,
  },
  {
    id: 'tech-015', type: 'TECHNICAL', category: 'dynamic-programming', difficulty: 'HARD',
    question: 'Given two strings s and t, return the length of their longest common subsequence. A subsequence need not be contiguous.',
    requiresCode: true,
    starterCode: `function longestCommonSubsequence(s: string, t: string): number {\n  // Your solution here\n}`,
    googleFocus: true,
  },

  // Linked Lists
  {
    id: 'tech-016', type: 'TECHNICAL', category: 'linked-lists', difficulty: 'EASY',
    question: 'Given the head of a singly linked list, reverse the list, and return its head.',
    requiresCode: true,
    starterCode: `class ListNode {\n  val: number\n  next: ListNode | null\n  constructor(val = 0, next = null) { this.val = val; this.next = next; }\n}\n\nfunction reverseList(head: ListNode | null): ListNode | null {\n  // Your solution here\n}`,
    googleFocus: false,
  },
  {
    id: 'tech-017', type: 'TECHNICAL', category: 'linked-lists', difficulty: 'MEDIUM',
    question: 'Given the head of a linked list, determine if it contains a cycle. Return true if a cycle exists.',
    requiresCode: true,
    starterCode: `class ListNode {\n  val: number\n  next: ListNode | null\n  constructor(val = 0, next = null) { this.val = val; this.next = next; }\n}\n\nfunction hasCycle(head: ListNode | null): boolean {\n  // Your solution here\n}`,
    googleFocus: false,
  },

  // Sorting & Searching
  {
    id: 'tech-018', type: 'TECHNICAL', category: 'sorting', difficulty: 'MEDIUM',
    question: 'Given a rotated sorted array, search for a target value and return its index, or -1 if not found. You must write an O(log n) algorithm.',
    requiresCode: true,
    starterCode: `function search(nums: number[], target: number): number {\n  // Your solution here\n}`,
    googleFocus: true,
  },
  {
    id: 'tech-019', type: 'TECHNICAL', category: 'sorting', difficulty: 'HARD',
    question: 'Given two sorted arrays of sizes m and n, return the median of the two sorted arrays. The overall runtime complexity must be O(log(m+n)).',
    requiresCode: true,
    starterCode: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  // Your solution here\n}`,
    googleFocus: true,
  },

  // Hash Maps
  {
    id: 'tech-020', type: 'TECHNICAL', category: 'hash-maps', difficulty: 'MEDIUM',
    question: 'Design a data structure that supports insert, delete, and getRandom operations in O(1) average time.',
    requiresCode: true,
    starterCode: `class RandomizedSet {\n  insert(val: number): boolean { /* return true if val was not present */ }\n  remove(val: number): boolean { /* return true if val was present */ }\n  getRandom(): number { /* return a random element */ }\n}`,
    googleFocus: true,
  },
  {
    id: 'tech-021', type: 'TECHNICAL', category: 'hash-maps', difficulty: 'HARD',
    question: 'Given an array of strings strs, group the anagrams together and return them as a list of lists.',
    requiresCode: true,
    starterCode: `function groupAnagrams(strs: string[]): string[][] {\n  // Your solution here\n}`,
    googleFocus: false,
  },

  // Recursion & Backtracking
  {
    id: 'tech-022', type: 'TECHNICAL', category: 'recursion', difficulty: 'MEDIUM',
    question: 'Given an array of distinct integers, return all possible subsets (the power set). The solution set must not contain duplicate subsets.',
    requiresCode: true,
    starterCode: `function subsets(nums: number[]): number[][] {\n  // Your solution here\n}`,
    googleFocus: false,
  },
  {
    id: 'tech-023', type: 'TECHNICAL', category: 'recursion', difficulty: 'HARD',
    question: 'Given an m x n board of characters and a list of words, return all words on the board. Each word must be constructed from letters in sequentially adjacent cells.',
    requiresCode: true,
    starterCode: `function findWords(board: string[][], words: string[]): string[] {\n  // Your solution here\n}`,
    googleFocus: true,
  },

  // Design
  {
    id: 'tech-024', type: 'TECHNICAL', category: 'design', difficulty: 'MEDIUM',
    question: 'Design and implement an LRU (Least Recently Used) cache with O(1) get and put operations.',
    requiresCode: true,
    starterCode: `class LRUCache {\n  constructor(capacity: number) {}\n  get(key: number): number { /* return -1 if not found */ }\n  put(key: number, value: number): void {}\n}`,
    googleFocus: true,
  },
  {
    id: 'tech-025', type: 'TECHNICAL', category: 'design', difficulty: 'HARD',
    question: 'Implement a system that counts the number of elements in a stream that fall within a given range [lower, upper] in O(log n) time.',
    requiresCode: true,
    starterCode: `class RangeCounter {\n  add(num: number): void {}\n  count(lower: number, upper: number): number { /* count elements in [lower, upper] */ }\n}`,
    googleFocus: true,
  },

  // Additional
  {
    id: 'tech-026', type: 'TECHNICAL', category: 'arrays', difficulty: 'MEDIUM',
    question: 'Given an unsorted integer array, find the smallest missing positive integer. You must implement an O(n) time and O(1) space solution.',
    requiresCode: true,
    starterCode: `function firstMissingPositive(nums: number[]): number {\n  // Your solution here\n}`,
    googleFocus: true,
  },
  {
    id: 'tech-027', type: 'TECHNICAL', category: 'strings', difficulty: 'MEDIUM',
    question: 'Given a string containing just parentheses characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    requiresCode: true,
    starterCode: `function isValid(s: string): boolean {\n  // Your solution here\n}`,
    googleFocus: false,
  },
  {
    id: 'tech-028', type: 'TECHNICAL', category: 'dynamic-programming', difficulty: 'MEDIUM',
    question: 'Given a 2D grid filled with non-negative numbers, find a path from the top-left to the bottom-right corner that minimizes the sum of all numbers along its path.',
    requiresCode: true,
    starterCode: `function minPathSum(grid: number[][]): number {\n  // Your solution here\n}`,
    googleFocus: false,
  },
  {
    id: 'tech-029', type: 'TECHNICAL', category: 'graphs', difficulty: 'MEDIUM',
    question: 'There are n courses numbered 0 to n-1. Given prerequisites pairs [a, b] meaning you must take b before a, determine if it is possible to finish all courses.',
    requiresCode: true,
    starterCode: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  // Your solution here\n}`,
    googleFocus: true,
  },
  {
    id: 'tech-030', type: 'TECHNICAL', category: 'trees', difficulty: 'MEDIUM',
    question: 'Given the root of a binary tree, return the level order traversal of its node values (i.e., from left to right, level by level).',
    requiresCode: true,
    starterCode: `class TreeNode {\n  val: number\n  left: TreeNode | null\n  right: TreeNode | null\n  constructor(val = 0) { this.val = val; this.left = null; this.right = null; }\n}\n\nfunction levelOrder(root: TreeNode | null): number[][] {\n  // Your solution here\n}`,
    googleFocus: false,
  },
]
