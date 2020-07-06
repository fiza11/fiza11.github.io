import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const Week1 = () => (
  <Layout>
    <div style={{ margin: `1rem auto`, marginLeft: `10rem`, marginRight: `10rem`}}>
        <h2>Week 2</h2>
        <strong>July 6, 2020</strong>
        <hr></hr>
        <p>This week I worked on debugging errors. I reinstalled CUDA toolkit as there was a linker error. The error was due to an external library. I had to explicitly link it. We don't have to do it for the standard library as linker already knows where to find it.</p>
        <ul>
            <li>
                Initially, <code>fill</code> method from both <code>Matrix</code> and <code>Vector</code> classes and their GPU counter parts was put into the <code>operations</code>module. This caused an issue whenever <code>fill</code> method was being called for<code>VectorGPU</code> or <code>MatrixGPU</code>.
            </li>
            <li>
                To solve this error, I tried using dynamic binding to inherit ContainerCPU in VectorCPU and MatrixCPU and similarly, ContainerGPU in VectorGPU and MatrixGPU but it gave some error. Instead of using container classes for CPU and GPU, shifting <code>fill</code> method for cuda data structures to a new <code>operations</code> module in <code>cuda/core</code> solved the issue.
            </li>
            <li>
                I ran the tests <code>test_core</code> and <code>test_cuda</code>. <code>test_core</code> ran successfully but <code>test_cuda</code> didn't. 2 tests from Cuda failed and I tried fixing it but got new errors. I'll try fixing it and hopefully I'll figure it out. 
            </li>
        </ul>
        <center><Link to="/">Go back to the homepage</Link></center>
        </div>
  </Layout>
)

export default Week1
