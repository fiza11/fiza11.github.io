import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const Week1 = () => (
  <Layout>
    <div style={{ margin: `1rem auto`, marginLeft: `10rem`, marginRight: `10rem`}}>
        <h2>Week 5</h2>
        <strong>August 9, 2020</strong>
        <hr></hr>
        This week we discussed implementation of AdaBoost algorithm and finalised the structure. We'll try to implement the algorithm based on this <a href="https://web.stanford.edu/~hastie/Papers/samme.pdf">research paper</a>.
        <ul>
            <li>
                Create an <code>Adaboost</code> class to which data can be passed. We'll write functions to train the model and predict output classes. Main function will take an input of the dataset and classes. 
            </li>
            <li>
                Create a <code>WeakClassifier</code> class and use decision stumps as a weak classifier. We'll use Gini Index to compare the performance of stumps. 
            </li>
            <li>
                Find a threshold value to split the examples into two subsets and apply AdaBoost to build an ensemble of decision stumps. Output will be a collection of stumps where each stump will be represented as a struct. 
            </li>
        </ul>
        <center><Link to="/">Go back to the homepage</Link></center>
        </div>
  </Layout>
)

export default Week1
