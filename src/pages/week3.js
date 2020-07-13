import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const Week1 = () => (
  <Layout>
    <div style={{ margin: `1rem auto`, marginLeft: `10rem`, marginRight: `10rem`}}>
        <h2>Week 3</h2>
        <strong>July 13, 2020</strong>
        <hr></hr>
        <p>This week I learnt mainly about CUDA streams. I learnt how to transfer data efficiently between the host and device and and how to overlap data transfers in CUDA.</p>
        <ul>
            <li>
                Initially, I tried using <code>Thrust</code>,  a CUDA C++ template library to implement parallel operations but it was useless. I proposed an idea to use non-default streams for issuing various kernels to different operations for parallel execution. The idea was to use <code>n</code> streams, allocate pinned memory and then perform asynchronous memory copy/fill on each stream to fill <code>n</code> vectors. 
            </li>
            <li>
                I tried using lesser number of streams and then filling <code>n</code> vectors using some round robin algorithms but couldn't propose the API to support this idea. 
            </li>
        </ul>
        <center><Link to="/">Go back to the homepage</Link></center>
        </div>
  </Layout>
)

export default Week1
