import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
} from '@mui/material';

function ImportValidate() {
  const location = useLocation();
  const validationData = location.state?.validationData;

  return (
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h5" gutterBottom>
        Import Validation Results
      </Typography>
      {validationData && validationData.validation_error ? (
        <div>
          {/* <h3>Summary</h3> */}
          {/* <ul>
            {validationData.validation_error.map((item, index) => (
              <li key={index}>
                Row {item.row}: {item.error.length > 0 ? `${item.error.length} error(s)` : 'No errors'}
              </li>
            ))}
          </ul> */}
          <Typography variant="h6" gutterBottom>
            Detailed Errors
          </Typography>
          <List>
            {validationData.validation_error.map((item, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#f50057' }}>{item.row}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">Row {item.row}</Typography>}
                  secondary={
                    item.error.length > 0 ? (
                      <List>
                        {item.error.map((error, errorIndex) => (
                          <ListItem key={errorIndex}>
                            <ListItemText
                              primary={<Typography variant="body2" color="error">{error}</Typography>}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2">No errors in this row.</Typography>
                    )
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      ) : (
        <Typography variant="body1">No validation data available.</Typography> )}
    </Box>
  );
}

export default ImportValidate;