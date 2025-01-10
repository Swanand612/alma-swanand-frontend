"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addLead } from "@/store/leadSlice";
import { AppDispatch } from "@/store/store";

const visaTypes = [
  { id: "o1", label: "O-1" },
  { id: "eb1a", label: "EB1-A" },
  { id: "eb2niw", label: "EB-2 NIW" },
  { id: "unknown", label: "I don't know" },
] as const;

// Common countries list - can be expanded
const countries = [
  "United States",
  "Mexico",
  "Canada",
  "Brazil",
  "China",
  "India",
  "Russia",
  "United Kingdom",
  "France",
  "Germany",
  "Japan",
  "South Korea",
  "Australia",
  "Spain",
  "Italy",
].sort();

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  linkedin: z.string().url("Invalid LinkedIn URL"),
  country: z.string().min(2, "Country is required"),
  visas: z.array(z.string()).min(1, "Please select at least one visa type"),
  resume: z.instanceof(File).optional(),
  message: z.string().min(10, "Please provide more details about your case"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LeadForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      linkedin: "",
      country: "",
      visas: [],
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "visas") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "resume" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await fetch("/api/submit-lead", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Submission failed");
      }

      const newLead = await response.json();
      dispatch(addLead(newLead));

      router.push("/thank-you");
    } catch (error) {
      console.error("Submission error:", error);
      // Here you might want to show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="justify-center bg-[#d9dea5] rounded-t-lg relative overflow-hidden h-[20rem]">
        <div className="absolute -left-12 -top-12">
          <div className="w-32 h-32 bg-[#C5D800] rounded-full opacity-80 absolute" />
          <div className="w-32 h-32 bg-[#C5D800] rounded-full opacity-60 absolute top-24 left-16" />
          <div className="w-32 h-32 bg-[#C5D800] rounded-full opacity-40 absolute top-48 left-16" />
          <div className="w-32 h-32 bg-[#C5D800] rounded-full opacity-40 absolute top-60" />
        </div>

        <span className="ml-[30rem] mr-auto text-justify pb-6">
          <img
            src="https://cdn.prod.website-files.com/656ddb1f77f5af1d193d7150/656ddd16e17e0d8eed192bed_Group%2037.png"
            loading="lazy"
            width="124"
            alt=""
            class="f-logo"
          />
        </span>
        <CardTitle className="text-3xl font-bold text-black relative z-10 ml-[30rem] mr-auto text-justify">
          Get An Assessment
          <br />
          Of Your Immigration Case
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 w-[30rem] ml-auto mr-auto">
        <span className="flex flex-col items-center">
          <svg
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>file_infor_fill</title>
            <g
              id="页面-1"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g id="File" transform="translate(-672.000000, -240.000000)">
                <g
                  id="file_infor_fill"
                  transform="translate(672.000000, 240.000000)"
                >
                  <path
                    d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                    id="MingCute"
                    fill-rule="nonzero"
                  ></path>
                  <path
                    d="M12,2 L12,8.5 C12,9.32843 12.6716,10 13.5,10 L13.5,10 L20,10 L20,20 C20,21.1046 19.1046,22 18,22 L18,22 L6,22 C4.89543,22 4,21.1046 4,20 L4,20 L4,4 C4,2.89543 4.89543,2 6,2 L6,2 L12,2 Z M11.99,15 L11,15 C10.4477,15 10,15.4477 10,16 C10,16.5523 10.4477,17 11,17 L11,17 L11,17.99 C11,18.5478 11.4522,19 12.01,19 L12.01,19 L12.5,19 C13.0523,19 13.5,18.5523 13.5,18 C13.5,17.6299 13.2989,17.3067 13,17.1338 L13,17.1338 L13,16.01 C13,15.4522 12.5478,15 11.99,15 L11.99,15 Z M12,12 C11.4477,12 11,12.4477 11,13 C11,13.5523 11.4477,14 12,14 C12.5523,14 13,13.5523 13,13 C13,12.4477 12.5523,12 12,12 Z M14,2.04336 C14.3759,2.12295 14.7241,2.30991 15,2.58579 L15,2.58579 L19.4142,7 C19.6901,7.27588 19.8771,7.62406 19.9566,8 L19.9566,8 L14,8 Z"
                    id="形状结合"
                    fill="blue"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </span>
        <p className="flex flex-col font-bold text-gray-700 mb-6 text-center">
          <h2 className="text-xl">Want to understand your visa options? </h2>
          <span>
            Submit the form below and our team of experienced attorneys will
            review your information and send a preliminary assessment of your
            case based on your goals.
          </span>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Country of Citizenship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="LinkedIn /Personal Website URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <span className="flex flex-col items-center">
              <svg
                fill="blue"
                width="40px"
                height="40px"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M829.436 911.36c45.245 0 81.92-36.675 81.92-81.92V194.56c0-45.245-36.675-81.92-81.92-81.92h-634.88c-45.238 0-81.92 36.679-81.92 81.92v634.88c0 45.241 36.682 81.92 81.92 81.92h634.88zm0 40.96h-634.88c-67.859 0-122.88-55.017-122.88-122.88V194.56c0-67.863 55.021-122.88 122.88-122.88h634.88c67.866 0 122.88 55.014 122.88 122.88v634.88c0 67.866-55.014 122.88-122.88 122.88z" />
                <path d="M378.126 308.874c0-33.043-26.787-59.832-59.832-59.832-33.039 0-59.832 26.794-59.832 59.832s26.794 59.832 59.832 59.832c33.045 0 59.832-26.79 59.832-59.832zm40.96 0c0 55.663-45.125 100.792-100.792 100.792-55.66 0-100.792-45.132-100.792-100.792s45.132-100.792 100.792-100.792c55.667 0 100.792 45.129 100.792 100.792zm346.444 0c0-33.043-26.787-59.832-59.832-59.832-33.039 0-59.832 26.794-59.832 59.832s26.794 59.832 59.832 59.832c33.045 0 59.832-26.79 59.832-59.832zm40.96 0c0 55.663-45.125 100.792-100.792 100.792-55.66 0-100.792-45.132-100.792-100.792s45.132-100.792 100.792-100.792c55.667 0 100.792 45.129 100.792 100.792zM378.126 715.126c0-33.043-26.787-59.832-59.832-59.832-33.039 0-59.832 26.794-59.832 59.832s26.794 59.832 59.832 59.832c33.045 0 59.832-26.79 59.832-59.832zm40.96 0c0 55.663-45.125 100.792-100.792 100.792-55.66 0-100.792-45.132-100.792-100.792s45.132-100.792 100.792-100.792c55.667 0 100.792 45.129 100.792 100.792zm346.444 0c0-33.043-26.787-59.832-59.832-59.832-33.039 0-59.832 26.794-59.832 59.832s26.794 59.832 59.832 59.832c33.045 0 59.832-26.79 59.832-59.832zm40.96 0c0 55.663-45.125 100.792-100.792 100.792-55.66 0-100.792-45.132-100.792-100.792s45.132-100.792 100.792-100.792c55.667 0 100.792 45.129 100.792 100.792zM571.828 512c0-33.043-26.787-59.832-59.832-59.832-33.039 0-59.832 26.794-59.832 59.832s26.794 59.832 59.832 59.832c33.045 0 59.832-26.79 59.832-59.832zm40.96 0c0 55.663-45.125 100.792-100.792 100.792-55.66 0-100.792-45.132-100.792-100.792s45.132-100.792 100.792-100.792c55.667 0 100.792 45.129 100.792 100.792z" />
              </svg>
            </span>

            <FormField
              control={form.control}
              name="visas"
              render={() => (
                <FormItem>
                  <FormLabel className="text-xl">
                    Visa categories of interest?
                  </FormLabel>
                  <div className="grid gap-4 mt-2">
                    {visaTypes.map((visa) => (
                      <FormField
                        key={visa.id}
                        control={form.control}
                        name="visas"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(visa.id)}
                                onCheckedChange={(checked) => {
                                  const value = field.value || [];
                                  if (checked) {
                                    field.onChange([...value, visa.id]);
                                  } else {
                                    field.onChange(
                                      value.filter((v) => v !== visa.id)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {visa.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Resume / CV</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <span className="flex flex-col items-center">
              <svg
                width="40px"
                height="40px"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10 6.49228C11.4641 3.87207 16.5 4.78701 16.5 8.57245C16.5 11.1012 14.3333 13.4103 10 15.5C5.66667 13.4103 3.5 11.1012 3.5 8.57245C3.5 4.78701 8.5359 3.87207 10 6.49228Z"
                  fill="blue"
                />
              </svg>
            </span>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">
                    How can we help you?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your immigration goals and background..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
