import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const Week1 = () => (
  <Layout>
    <div style={{ margin: `1rem auto`, marginLeft: `10rem`, marginRight: `10rem`}}>
        <h2>Week 4</h2>
        <strong>July 20, 2020</strong>
        <hr></hr>
        <ul>
            <li>
                I implemented the idea of using <code>n</code> non-default streams to fill <code>n</code> vectors parallely. Basic idea was to create <code>n</code> streams in the host code, allocate pinned memory, perform asynchronous memory copy function on each stream and then synchronize for both memory transfer and kernel launch.
            </li>
            <li>
                I implemented <code>Sum</code> for both CPU and CUDA. <code>Sum</code> computes the sum of elements of the given vector and the given function applied on each element. I also wrote tests for CUDA to check the functionality of <code>Sum</code>.
            </li>
            <li>
                Code is compiling perfectly but tests are giving an <code>invalid device symbol</code> error. This error is due to <code>cudaMemcpyFromSymbol</code>. I tried replacing symbol API calls but realised that CUDA runtime maintains a dynamic mapping between statically defined device symbols and symbol API calls are the only way to retrieve this mapping for <code>__constant__</code> and <code>__device__</code> symbols. I'm still trying to fix this error.
            </li>
        </ul>
        <center><Link to="/">Go back to the homepage</Link></center>
        </div>
  </Layout>
)

export default Week1
