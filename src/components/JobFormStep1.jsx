import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Clock, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';



// Floating icon component
const FloatingIcon = ({ children, className }) => (
  <motion.div
    className={`absolute bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg ${className}`}
    initial={{ y: 0, opacity: 0, scale: 0.5 }}
    animate={{ y: [0, -10, 0], opacity: 1, scale: 1 }}
    transition={{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

  const JobFormStep1 = ({ formData, handleInputChange, onNewSubmit, jobDescription }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.jobTitle) newErrors.jobTitle = 'Job Title is required';
    if (!formData.jobType) newErrors.jobType = 'Job Type is required';
    if (!formData.requiredSkills) newErrors.requiredSkills = 'Please enter one or more skills';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const result = await onNewSubmit(formData); // Must return string

      const skillsArray = formData.requiredSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);
      localStorage.setItem('keySkills', JSON.stringify(skillsArray));
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-start justify-start px-4 py-10">
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
              <div className="text-lg font-semibold text-blue-600 animate-pulse">
                Processing...
              </div>
            </div>
          )}

          {/* Layout */}
          <div className="w-full max-w-7xl flex flex-col lg:flex-row items-start justify-start gap-12 relative px-6 lg:pl-20 lg:pr-8 py-24">

            {/* Floating Icons */}
            <div className="hidden lg:block">
              <FloatingIcon className="top-10 -left-8 text-blue-500">
                <Briefcase size={24} />
              </FloatingIcon>
              <FloatingIcon className="bottom-16 -right-8 text-green-500">
                <Star size={24} />
              </FloatingIcon>
            </div>

            {/* LEFT: Form */}
            <div className="flex flex-col space-y-8 max-w-2xl w-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <div className="mb-2 text-left">
                  <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-orange-400 drop-shadow-md">
                    AI Generated <br />
                    <span className="text-black">Job Description</span>
                  </h1>
                  <p className="mt-4 text-lg text-gray-500 max-w-xl">
                    Built with AI. Designed for Recruiters.
                  </p>
                </div>
              </motion.div>

              <motion.div layout className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-sky-50/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full"
                >
                  {/* Job Title & Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Job Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Senior Frontend Developer"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="bg-white/70"
                        disabled={isLoading}
                      />
                      {errors.jobTitle && (
                        <p className="text-red-600 text-sm">{errors.jobTitle}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Years of Experience
                      </Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 3"
                        value={formData.yearsOfExperience}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleInputChange('yearsOfExperience', value);
                          }
                        }}
                        onWheel={(e) => e.target.blur()}
                        className="bg-white/70"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Job Type & Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Job Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.jobType}
                        onValueChange={(value) => handleInputChange('jobType', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="bg-white/70">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.jobType && (
                        <p className="text-red-600 text-sm">{errors.jobType}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Key Skills <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. JAVA, REACT"
                        value={formData.requiredSkills}
                        onChange={(e) => handleInputChange('requiredSkills', e.target.value)}
                        className="bg-white/70"
                        disabled={isLoading}
                      />
                      {errors.requiredSkills && (
                        <p className="text-red-600 text-sm">{errors.requiredSkills}</p>
                      )}
                    </div>
                    </div>
                    
                    {/* Industry */}
                      <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Industry <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Information Technology, Marketing"
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="bg-white/70"
                        disabled={isLoading}
                      />
                      {errors.industry && (
                        <p className="text-red-600 text-sm">{errors.industry}</p>
                      )}
                    </div>


                  {/* Submit Button */}
                  <Button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 mt-4"
                  >
                    {isLoading ? 'Processing...' : 'Submit'}
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT: Job Description Card */}
            {jobDescription && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-xl w-full text-gray-900 overflow-y-auto max-h-[80vh]"
              >
                <h2 className="text-2xl font-bold mb-4 text-blue-800">
                  Generated Job Description
                </h2>
                <pre className="whitespace-pre-wrap text-sm font-medium font-serif leading-relaxed text-gray-900">
                  {jobDescription}
                </pre>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default JobFormStep1;
