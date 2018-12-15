#ifndef BINARYSEARCHTREE_H
#define BINARYSEARCHTREE_H

#include "node.h"
#include "mainwindow.h"
//============================================================================
// Binary Search Tree class definition
//============================================================================

/*
 * Define a class containing data members and methods to
 * implement a binary search tree
 */
class BinarySearchTree {

    private:
        Node* root;
        void addNode(Node* node, Bid bid);
        void inOrder(Node* node);
        Node* removeNode(Node* node, std::string bidId);
        MainWindow* mainWin;

    public:
        BinarySearchTree(int val, Node* node, MainWindow* main);
        virtual ~BinarySearchTree();
        void InOrder();
        void Insert(Bid bid);
        void Remove(std::string bidId);
        Bid Search(std::string bidId);
};

#endif // BINARYSEARCHTREE_H
