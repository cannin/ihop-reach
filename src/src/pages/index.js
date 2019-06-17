// @flow

import React from "react"

import Layout from "../components/layout"

const IndexPage = () => {
  return (
    <Layout>
      <div className="container my-4">
        {/* Instruction block */}
        <div>
          <h1 className="display-4 w-100">Instructions</h1>
          <div>
            <p className="lead">
              The following steps will help you utilize the application in the
              best manner
            </p>
            <ul>
              <li>
                Morbi in sem quis dui placerat ornare. Pellentesque odio nisi,
                euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras
                consequat
              </li>
              <li>
                Praesent dapibus, neque id cursus faucibus, tortor neque egestas
                augue, eu vulputate magna eros eu erat. Aliquam erat volutpat.
                Nam dui mi, tincidunt quis, accumsan porttitor, facilisis
                luctus, metus.
              </li>
              <li>
                Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
                consectetuer ligula vulputate sem tristique cursus. Nam nulla
                quam, gravida non, commodo a, sodales sit amet, nisi.
              </li>
            </ul>
          </div>
        </div>

        {/* About block */}
        <div>
          <h1 className="display-4 w-100">About iHOP</h1>
          <div>
            <p className="lead">
              An application for users to access biological data extracted from
              biomedical literature.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Phasellus hendrerit. Pellentesque aliquet nibh nec urna. In nisi
              neque, aliquet vel, dapibus id, mattis vel, nisi. Sed pretium,
              ligula sollicitudin laoreet viverra, tortor libero sodales leo,
              eget blandit nunc tortor eu nibh. Nullam mollis. Ut justo.
              Suspendisse potenti.
              <br />
              Sed egestas, ante et vulputate volutpat, eros pede semper est,
              vitae luctus metus libero eu augue. Morbi purus libero, faucibus
              adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent
              elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum
              volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu
              pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu,
              fermentum et, dapibus sed, urna.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
