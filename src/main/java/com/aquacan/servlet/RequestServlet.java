package com.aquacan.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.postgresql.ds.PGSimpleDataSource;


public class RequestServlet extends HttpServlet{

	
	private PGSimpleDataSource datasource;
	
	// JDBC driver name and database URL
    static final String JDBC_DRIVER = "org.postgresql.Driver";  
    //static final String DB_URL = "jdbc:postgresql://localhost:5432/aquacan";
    static final String DB_URL = "jdbc:postgresql://ec2-54-235-125-135.compute-1.amazonaws.com:5432/d66ft4j2561eov";
    
    //  Database credentials
//    static final String USER = "postgres";
//    static final String PASS = "openstream";
    
    static final String USER = "smmxrxpfxpzrsr";
    static final String PASS = "s9SaoBoXIIAHYw67UwhXIfgFZA";
	
    
    @Override
	public void init() throws ServletException {
		// TODO Auto-generated method stub
		super.init();
		 try {
			 datasource = new PGSimpleDataSource();
			 datasource.setUrl(DB_URL);
			 datasource.setUser(USER);
			 datasource.setPassword(PASS);
			 
	    }
	    catch (Exception e) {
	      e.printStackTrace();
	    }
	}
    
    private Connection getConnection() throws SQLException {
	    return datasource.getConnection();
	}
    
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		//super.doGet(req, resp);
	}
	
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		//super.doPost(req, resp);
		
		
		Connection connection=null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
	    try {
	    	connection = getConnection();
		      //..<do JDBC work>..
			StringBuilder sb = new StringBuilder();
			String line;
			try {
			    BufferedReader reader = req.getReader();
			    while ((line = reader.readLine()) != null)
			    	sb.append(line);
			  } catch (Exception e) {System.out.println(e);}

		
			JSONObject requestObject = new JSONObject(sb.toString());
			
			System.out.println(requestObject);
	    	
			if(requestObject.getString("action").equalsIgnoreCase("new_user_register")){
				String first_name = requestObject.getString("first_name");
				String last_name = requestObject.getString("last_name");
				String password = "";
				if(requestObject.has("password"))
					password = requestObject.getString("password");
				String email = requestObject.getString("email_id");
				
				
				
			    String sql;
			    sql = "SELECT * FROM aquacandb.USER_DATA WHERE mail_id='"+email+"'";
			    stmt = connection.prepareStatement(sql);
			    rs = stmt.executeQuery();
			    if (!rs.isBeforeFirst() ) {
			    	 sql = "INSERT INTO aquacandb.USER_DATA (password,first_name,last_name,mail_id) VALUES ('"+password+"','"+first_name+"','"+last_name+"','"+email+"')";
			    	 System.out.println(sql);
			    	 stmt = connection.prepareStatement(sql);
			    	 stmt.executeUpdate();
			    	 String responseStr = "Successfully inserted user in DB";
		    		resp.setHeader("Cache-Control", "no-cache");
					sendResponse(resp,responseStr.getBytes("UTF-8")); 
		    	}else{
		    		String responseStr = "User already exist";
		    		resp.setHeader("Cache-Control", "no-cache");
					sendResponse(resp,responseStr.getBytes("UTF-8"));
		    		
		    	}
			}else if(requestObject.getString("action").equalsIgnoreCase("login")){
				String password = requestObject.getString("password");
				String email = requestObject.getString("email_id");
				
				
			    String sql;
			    sql = "SELECT * FROM aquacandb.USER_DATA WHERE mail_id='"+email+"' AND password='"+password+"'";
			    stmt = connection.prepareStatement(sql);
			    rs = stmt.executeQuery();
			    if (!rs.isBeforeFirst() ) {
			    	String responseStr = "User does not exist";
		    		resp.setHeader("Cache-Control", "no-cache");
					sendResponse(resp,responseStr.getBytes("UTF-8")); 
			    }else{
			    	JSONArray responseArr = convertToArray(rs);
			    	resp.setHeader("Cache-Control", "no-cache");
					sendResponse(resp,responseArr.toString().getBytes("UTF-8"));
			    	
			    }
			}else if(requestObject.getString("action").equalsIgnoreCase("update_user_data")){
				JSONObject data = new JSONObject(requestObject.getString("data"));
				String updateString = "";
				
				//check for all the fields coming coming from client and execute appropriate update query
				if(data.has("DOB") && !data.getString("DOB").equalsIgnoreCase("")){
					java.util.Date dt = new java.util.Date(data.getString("DOB"));
					 java.text.SimpleDateFormat sdf = 
						     new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					 updateString += "DOB='"+sdf.format(dt)+"',";
				}
				
				if(data.has("first_name") && !data.getString("first_name").equalsIgnoreCase("")){
					updateString += "first_name='"+data.getString("first_name")+"',";
				}
				if(data.has("last_name") && !data.getString("last_name").equalsIgnoreCase("")){
					updateString += "last_name='"+data.getString("last_name")+"',";
				}
				if(data.has("profile_pic") && !data.getString("profile_pic").equalsIgnoreCase("")){
					updateString += "profile_pic='"+data.getString("profile_pic")+"',";
				}
				if(data.has("gender") && !data.getString("gender").equalsIgnoreCase("")){
					updateString += "gender='"+data.getString("gender").substring(0, 1)+"',";
				}
				if(data.has("address") && !data.getString("address").equalsIgnoreCase("")){
					updateString += "address='"+data.getString("address")+"',";
				}
				if(data.has("latitude") && !data.getString("latitude").equalsIgnoreCase("")){
					updateString += "latitude='"+data.getString("latitude")+"',";
				}
				if(data.has("longitude") && !data.getString("longitude").equalsIgnoreCase("")){
					updateString += "longitude='"+data.getString("longitude")+"',";
				}
				if(data.has("contact_number") && !data.getString("contact_number").equalsIgnoreCase("")){
					updateString += "contact_number='"+data.getString("contact_number")+"',";
				}
				if(updateString!=""){
					updateString = updateString.substring(0, updateString.length()-1);
					
					String sql = "UPDATE USER_DATA SET "
					 		+ updateString
					 		+" WHERE mail_id='"+data.getString("mail_id")+"'";
					System.out.println(sql);
					stmt = connection.prepareStatement(sql);
					stmt.executeUpdate();
				}
				
				String sql = "SELECT * FROM aquacandb.USER_DATA WHERE mail_id='"+data.getString("mail_id")+"'";
				stmt = connection.prepareStatement(sql);
			    rs = stmt.executeQuery();
			    
			    JSONArray responseArr = convertToArray(rs);
				
	    		resp.setHeader("Cache-Control", "no-cache");
				sendResponse(resp,responseArr.toString().getBytes("UTF-8"));
			}
	    	
	    }
	    catch(JSONException e){
			e.printStackTrace();
		}
	    catch (SQLException sqlException) {
	      sqlException.printStackTrace();
	    }
	    catch (Exception e) {
		      e.printStackTrace();
		}
	    finally {
   	  if (rs != null) 
	        try {rs.close();} catch (SQLException e) {}
   	  if (stmt != null) 
		    try {stmt.close();} catch (SQLException e) {}
	      if (connection != null) 
	        try {connection.close();} catch (SQLException e) {}
	    }
	}
	
	
	public static JSONArray convertToArray( ResultSet rs )
		    throws SQLException, JSONException
  {
    JSONArray json = new JSONArray();
    ResultSetMetaData rsmd = rs.getMetaData();

    while(rs.next()) {
      int numColumns = rsmd.getColumnCount();
      JSONObject obj = new JSONObject();

      for (int i=1; i<numColumns+1; i++) {
        String column_name = rsmd.getColumnName(i);

        if(rsmd.getColumnType(i)==java.sql.Types.ARRAY){
         obj.put(column_name, rs.getArray(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.BIGINT){
         obj.put(column_name, rs.getInt(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.BOOLEAN){
         obj.put(column_name, rs.getBoolean(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.BLOB){
         obj.put(column_name, rs.getBlob(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.DOUBLE){
         obj.put(column_name, rs.getDouble(column_name)); 
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.FLOAT){
         obj.put(column_name, rs.getFloat(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.INTEGER){
         obj.put(column_name, rs.getInt(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.NVARCHAR){
         obj.put(column_name, rs.getNString(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.VARCHAR){
         obj.put(column_name, rs.getString(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.TINYINT){
         obj.put(column_name, rs.getInt(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.SMALLINT){
         obj.put(column_name, rs.getInt(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.DATE){
         obj.put(column_name, rs.getDate(column_name));
        }
        else if(rsmd.getColumnType(i)==java.sql.Types.TIMESTAMP){
        obj.put(column_name, rs.getTimestamp(column_name));   
        }
        else{
         obj.put(column_name, rs.getObject(column_name));
        }
      }

      json.put(obj);
    }

    return json;
  }
	
	private static void sendResponse(HttpServletResponse response, byte[] data){
		OutputStream out = null;
		try {

			response.setStatus( HttpServletResponse.SC_OK );
			response.setContentLength(data.length);
			out = response.getOutputStream();
			out.write(data);
			out.flush();
		} catch (IOException e) {
			System.out.println("Exception while sending response"+e);
		} finally {
			try{
				out.close();
			}catch (Exception e) {
			}
		}
	}
	
}
