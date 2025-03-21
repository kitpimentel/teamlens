// src/components/SampleAccountsPopup.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Key, Copy, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const accounts = [
  {
    role: "Administrator",
    description: "Full access to all features and settings",
    email: "admin@teamlens.com",
    password: "admin123",
    avatar: "https://ui-avatars.com/api/?name=Admin&background=0096c7&color=fff",
    color: "bg-blue-100 border-blue-200",
    hoverColor: "hover:bg-blue-50"
  },
  {
    role: "Project Manager",
    description: "Can manage projects and team members",
    email: "john.doe@teamlens.com",
    password: "password123",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=7209b7&color=fff",
    color: "bg-purple-100 border-purple-200",
    hoverColor: "hover:bg-purple-50"
  },
  {
    role: "UX Designer",
    description: "Access to design tools and assets",
    email: "jane.smith@teamlens.com",
    password: "designer123",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=4cc9f0&color=fff",
    color: "bg-teal-100 border-teal-200",
    hoverColor: "hover:bg-teal-50"
  }
];

export default function SampleAccountsPopup({ isOpen, onClose, onSelectAccount }) {
  const [copiedField, setCopiedField] = useState(null);
  const [expandedAccount, setExpandedAccount] = useState(null);
  
  const handleCopyToClipboard = (text, field, accountEmail) => {
    navigator.clipboard.writeText(text);
    setCopiedField(`${accountEmail}-${field}`);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => setCopiedField(null), 2000);
    
    toast.success(`${field === 'email' ? 'Email' : 'Password'} copied to clipboard`);
  };
  
  const handleSelectAccount = (email, password) => {
    onSelectAccount(email, password);
    toast.success(`Logging in as ${email}`, {
      description: "Redirecting to dashboard...",
      duration: 3000
    });
    onClose();
  };

  const toggleAccountExpansion = (email) => {
    setExpandedAccount(expandedAccount === email ? null : email);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto my-8 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg">Sample Accounts</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full p-1 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Select any of these sample accounts to explore the dashboard with different user permissions.
              </p>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {accounts.map((account) => (
                  <div 
                    key={account.email}
                    className={`border rounded-lg overflow-hidden transition-all duration-200 ${account.color} ${expandedAccount === account.email ? 'shadow-md' : ''}`}
                  >
                    <button 
                      onClick={() => toggleAccountExpansion(account.email)}
                      className={`p-3 flex items-center justify-between w-full text-left ${account.hoverColor} transition-colors`}
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={account.avatar} 
                          alt={account.role} 
                          className="w-10 h-10 rounded-full shadow-sm"
                        />
                        <div>
                          <h3 className="font-medium">{account.role}</h3>
                          <p className="text-xs text-gray-600">{account.description}</p>
                        </div>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedAccount === account.email ? 'rotate-90' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {expandedAccount === account.email && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white overflow-hidden"
                        >
                          <div className="p-3 space-y-3 border-t">
                            <div className="flex items-center justify-between group rounded hover:bg-gray-50 p-2 transition-colors">
                              <div className="flex items-center text-sm text-gray-700">
                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm truncate">{account.email}</span>
                              </div>
                              <button
                                className="text-gray-400 group-hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyToClipboard(account.email, 'email', account.email);
                                }}
                                aria-label="Copy email"
                              >
                                {copiedField === `${account.email}-email` ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between group rounded hover:bg-gray-50 p-2 transition-colors">
                              <div className="flex items-center text-sm text-gray-700">
                                <Key className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm">{account.password}</span>
                              </div>
                              <button
                                className="text-gray-400 group-hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyToClipboard(account.password, 'password', account.email);
                                }}
                                aria-label="Copy password"
                              >
                                {copiedField === `${account.email}-password` ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            
                            <Button
                              size="sm"
                              className="w-full text-sm h-9 mt-1 bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAccount(account.email, account.password);
                              }}
                            >
                              Log in as {account.role}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-4 italic">
                Note: These are demo accounts with limited permissions. No personal data is stored.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}