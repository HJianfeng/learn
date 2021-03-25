import javax.swing.*;
import javax.swing.event.*;

import java.awt.event.*;
import java.awt.*;

public class Index {
  
  public static void main(String[] args) {
    JFrame f = new JFrame("exr");
    f.setSize(250, 250);
    f.setLocationRelativeTo(null);
    f.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
    
    JPanel panel = new JPanel(){
      @Override
      public void paint(Graphics graphics) {
        super.paint(graphics);
        graphics.drawOval(100, 70, 30, 30);
        graphics.draw3DRect(105, 100, 20, 30, true);
        graphics.drawArc(10,40,90,50,0,180);
        graphics.drawLine(125, 100, 150, 120);// 右臂（画直线）
        graphics.drawLine(105, 130, 75, 150);// 左腿（画直线）
        graphics.drawLine(125, 130, 150, 150);// 右腿（画直线）
      }
    };
    f.add(panel);
    f.setVisible(true);
  }
}