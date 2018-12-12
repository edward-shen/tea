import * as React from 'react';

import '../css/AboutView.scss';

class AboutView extends React.Component<{}, {}> {
  public render() {
    return (
      <main className='aboutview'>
        <h1>Hello!</h1>
        <p>
          TRACE Evaluation Analysis (TEA) is brought to you by {
            <a href='https://eddie.sh'>Edward Shen</a>
          }, a
          student at Northeastern University. It is for other students so that
          they can better explore the vast data that Northeastern offers but
          in a vastly superior format.
        </p>

        <h3>What is tea?</h3>
        <p>
          Tea is a drink created from boiling tea leaves. It often contains
          caffeine (which makes up 30% of any college student) and is used as a
          refreshment. It can be offered cold, hot, or lukewarm, but it's not
          as good when it gets lukewarm. I wouldn't suggest drinking lukewarm
          tea. More information can be found on {
            <a href='https://en.wikipedia.org/wiki/Tea'>Wikipedia</a>
          }.
        </p>
        <p>
          TEA is an attempt as a drop in replacement for everyone. Students and
          professors should be able to simply use this site in lieu of TRACE.
          For administrators, this should provide help with visualizations of
          the data that you provide for us, if you don't have the tools already.
        </p>

        <h3>This is a data leak!</h3>
        <p>
          For the cybersecurity and/or privacy team at Northeastern: Please
          do not fear. If everything has been implemented correctly, the public
          1.0.0 release of TEA should authenticate users against Northeastern's
          SSO. If it has not been implemented properly, please feel free to
          reach out at my husky email. You should be able to find my email, so
          it won't be provided here.
        </p>

        <h3>Is all the data here?</h3>
        <p>
          For the most part, yes. Some data is missing because the locations for
          extracting data for a specific report is missing. If the data is missing,
          we will try to calculate and fill in the missing data as accurately as
          possible. If we do, we'll make sure to let you know.
        </p>

        <h3>This means we can just stop using TRACE!</h3>
        <p>
          For everyone but Northeastern, yes. TEA still relies on TRACE as a
          direct dependent to gather data from. If TRACE dies, so does TEA.
        </p>
        <p>
          That being said... If anyone at Northeastern would like to discuss
          moving everything to TEA, let me know and I'll be happy to discuss.
        </p>

        <h3>How can I help?</h3>
        <p>
          Three main ways: Spreading the word, contributing on Github, and
          maybe donations to keep the servers running. But lets be honest, no
          one's going to donate to this. Until I get enough requests to donate,
          I'm just going to not have a way to donate.
        </p>
      </main>);
  }
}

export default AboutView;
