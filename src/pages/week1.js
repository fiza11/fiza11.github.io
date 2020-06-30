import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const Week1 = () => (
  <Layout>
    <div style={{ margin: `1rem auto`, marginLeft: `10rem`, marginRight: `10rem`}}>
        <h2>Week 1</h2>
        <strong>June 29, 2020</strong>
        <hr></hr>
        <p>Currently the code base has mixed up CUDA kernels with C++ class and the API is too confusing. </p>
        <ul>
            <li>
                Removed the <code>fill</code> method from both <code>Matrix</code> and <code>Vector</code> classes and their GPU counter parts and shifted it to <code>operations</code> module.
            </li>
            <li>
                Shifted both CPU and CUDA implementations to <code>operations</code> module in <code>core</code> and <code>cuda/core</code>.
            </li>
            <li>
                Made changes at places where call to <code>fill</code> has been made.
            </li>
        </ul>
        <center><Link to="/">Go back to the homepage</Link></center>
        </div>
  </Layout>
)

export default Week1
