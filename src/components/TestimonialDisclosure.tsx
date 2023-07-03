import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { type Testimonial, type User } from "@prisma/client";
import ImageWF from "@/components/ImageWF";

type Props = {
  testimonial: Testimonial & { user: User };
};

const TestimonialDisclosure = ({ testimonial }: Props) => {
  return (
    <Disclosure key={testimonial?.id ?? ""}>
      {({ open }) => (
        <>
          <Disclosure.Button className="z-2 flex w-full items-center justify-between rounded-xl bg-neutral-700 px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ImageWF
                src={testimonial.user.image ?? ""}
                height={25}
                width={25}
                alt="Rose"
                className="aspect-square rounded-full object-cover"
              />
              <p className="max-w-[8rem] overflow-hidden truncate text-ellipsis">
                {testimonial.user.name}
              </p>
            </div>
            <ChevronDownIcon
              className={`duration-150 ${open ? "rotate-180" : ""} w-5`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="realtive z-0 w-full -translate-y-6 rounded-b-xl bg-neutral-700 px-4 py-4 text-gray-300">
            <FontAwesomeIcon
              icon={faQuoteLeft}
              className="absolute text-neutral-400"
            />{" "}
            <p className="ml-6 mt-1">{testimonial?.content}</p>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default TestimonialDisclosure;
