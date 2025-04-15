import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import io from 'socket.io-client';

const Chat = () => {
  const user = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const groups = [
    { id: 'all', name: 'All Employees' },
    { id: 'hr', name: 'HR Team' },
    { id: 'dev', name: 'Developers' },
    { id: 'devops', name: 'DevOps Team' },
  ];

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001', {
      query: { userId: user?.id, role: user?.role },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('previousMessages', (previousMessages) => {
        setMessages(previousMessages);
      });

      // Join appropriate groups based on user role
      socket.emit('joinGroups', {
        groups: user?.role === 'CEO' ? ['all', 'hr', 'dev', 'devops'] : ['all', user?.department],
      });
    }
  }, [socket, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: user?.name,
        senderId: user?.id,
        group: activeGroup,
        timestamp: new Date().toISOString(),
      };

      socket.emit('message', message);
      setNewMessage('');
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.group === activeGroup ||
      (activeGroup === 'all' && message.group === 'all')
  );

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
      {/* Groups Sidebar */}
      <Paper
        elevation={3}
        sx={{
          width: 200,
          p: 2,
          mr: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Groups
        </Typography>
        <List>
          {groups.map((group) => {
            // Only show relevant groups based on user role
            if (
              user?.role === 'CEO' ||
              group.id === 'all' ||
              group.id === user?.department
            ) {
              return (
                <ListItem
                  key={group.id}
                  button
                  selected={activeGroup === group.id}
                  onClick={() => setActiveGroup(group.id)}
                >
                  <ListItemText primary={group.name} />
                </ListItem>
              );
            }
            return null;
          })}
        </List>
      </Paper>

      {/* Chat Area */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            {groups.find((g) => g.id === activeGroup)?.name}
          </Typography>
        </Box>

        {/* Messages List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            mb: 2,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
          }}
        >
          <List>
            {filteredMessages.map((message) => (
              <div key={message.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{message.sender[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" variant="subtitle1">
                          {message.sender}
                        </Typography>
                        <Chip
                          label={message.group}
                          size="small"
                          color="primary"
                        />
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body1"
                        color="text.primary"
                      >
                        {message.text}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {/* Message Input */}
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{ display: 'flex', gap: 1 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat; 