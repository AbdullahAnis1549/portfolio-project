import { motion } from 'framer-motion';

const Education = ({ education }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-white/10">
            {education.map((edu, index) => (
                <motion.div
                    key={edu._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative pl-20"
                >
                    <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-sky-500 border-4 border-dark" />
                    <div className="glass-card">
                        <span className="text-sky-400 text-sm font-medium">{edu.period}</span>
                        <h3 className="text-xl font-bold mt-1">{edu.degree} in {edu.field}</h3>
                        <h4 className="text-gray-300 font-medium">{edu.institution}</h4>
                        <p className="text-gray-400 mt-4">{edu.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default Education;
