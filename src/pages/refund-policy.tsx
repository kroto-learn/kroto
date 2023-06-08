import Layout from "@/components/layouts/main";
import Head from "next/head";

export default function RefundPolicy() {
  return (
    <Layout>
      <Head>
        <title>Refund Policy</title>
      </Head>
      <div className="mx-auto my-20 w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12">
        <div className="flex flex-grow flex-col gap-3">
          <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap">
            <div className="prose prose-invert w-full break-words">
              <h2>
                <strong>Refund Policy</strong>
              </h2>

              <p>
                At <strong>Kroto</strong>, we are committed to providing
                high-quality educational content to our students. We want you to
                be satisfied with your purchase, but understand that there may
                be circumstances where you need to request a refund. Please read
                our refund policy carefully before making a purchase.
              </p>

              <p>
                If you believe you are entitled to a refund, please contact us
                at <strong>kamal@kroto.in</strong> with your order number and
                the reason for your request. We will review your request and
                respond as soon as possible.
              </p>

              <h4>
                In case of Refund of <strong>Paid Courses</strong>, refund will
                not be approved if:
              </h4>

              <ul>
                <li>
                  A significant portion of the course has been consumed or
                  downloaded by a student before the refund was requested.
                </li>
                <li>
                  Multiple refunds have been requested by a student for the same
                  course.
                </li>
                <li>Excessive refunds have been requested by a student.</li>
                <li>
                  Users who have their account reported, banned or course access
                  disabled due to a violation of our Terms & Conditions.
                </li>
                <li>
                  A significant portion of the course has been consumed or
                  downloaded by a student before the refund was requested.
                </li>
              </ul>

              <p>
                Please note that we do not grant refunds for any subscription
                services unless otherwise required by applicable law.
              </p>

              <p>
                In certain countries, you may have additional legal rights as a
                consumer that override our refund policy. If you are located in
                one of these countries, please contact us at{" "}
                <strong>kamal@kroto.in</strong> to request a refund if you
                believe that you are entitled to one under applicable law.
              </p>

              <p>
                Thank you for choosing Kroto. We hope that you enjoy our
                services and look forward to your growth!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
